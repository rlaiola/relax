import { Relation } from "db/exec/Relation";
import { parseRelalg, relalgFromRelalgAstRoot, replaceVariables } from 'db/relalg';
import { getSerializeValueWithClassName } from "calc2/utils/worker-serde/serializer";
import { deserializeFromParsedObj } from "calc2/utils/worker-serde/deserializer"
import classes from "db/exec/classes";

/**
 * Worker definition for parallel execution of our "db engine", this is intended as a way
 * to reduce the processing overhead on the Main JS Thread for the Web Page,
 * since this process is CPU intensive and may lock it during extensive amounts of time,
 * causing page freezes, the usage of the worker can improve the user experience by handling this
 * on a separated thread.
 * - https://v4.webpack.js.org/loaders/worker-loader/
 * - https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
 */
const ctx: Worker = self as any;
const relationsCache: Map<string, { [name: string]: Relation }> = new Map();
function execRelalgText(text: string, relations: { [name: string]: Relation }) {
  try {
    const ast = parseRelalg(text, Object.keys(relations));
    replaceVariables(ast, relations);

    if (ast.child === null) {
      if (ast.assignments.length > 0) {
        return { success: null, error: 'calc.messages.error-query-missing-assignments-found' }
      }
      else {
        return { success: null, error: 'calc.messages.error-query-missing' }
      }
    }
    const root = relalgFromRelalgAstRoot(ast, relations);
    root.check();
    return { success: { root: getSerializeValueWithClassName(root), ast }, error: null }
  } catch (error) {
    return { success: null, error }
  }
}

type MessageRelalg = {
  type: "exec",
  payload: { text: string, id: string, groupName: string }
} | {
  type: "cacheRelations",
  payload: {
    relations: { [name: string]: Relation },
    groupName: string
  }
}

ctx.addEventListener("message", (event: MessageEvent<MessageRelalg>) => {
  if (!event) return;
  if (event.data.type === "exec") {
    const relations = relationsCache.get(event.data.payload.groupName);
    const result = execRelalgText(event.data.payload.text, relations || {})
    postMessage({
      ...result,
      id: event.data.payload.id
    });
  }
  if (event.data.type === "cacheRelations") {
    for (const key of Object.keys(event.data.payload.relations)) {
      event.data.payload.relations[key] = deserializeFromParsedObj(event.data.payload.relations[key], classes, {})
    }
    relationsCache.set(event.data.payload.groupName, event.data.payload.relations)
  }
});