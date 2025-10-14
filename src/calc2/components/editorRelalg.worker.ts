import { Relation } from "db/exec/Relation";
import { parseRelalg, relalgFromRelalgAstRoot, replaceVariables } from 'db/relalg';
import { getSerializeValueWithClassName } from "calc2/utils/worker-serde/serializer";
import { deserializeFromParsedObj } from "calc2/utils/worker-serde/deserializer";
import classes from "db/exec/classes";
import { t } from "../i18n";

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
const MAX_NUM_ROWS_ON_RESULT = 50_000_000;
const MAX_MEM_USAGE = 1073741824;

const relationsCache: Record<string, { [name: string]: Relation }> = {};
function execRelalgText(text: string, relations: { [name: string]: Relation }, withResult: boolean) {
  try {
    // const start = performance.now();
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
    const result = withResult ? root.getResult(true) : null
    // const took = performance.now() - start;
    // if (result) {
    //   const memoryUsage = result.getEstimatedMemoryUsage();
    //   console.log({
    //     action: 'queryExecutionInfo',
    //     query: text,
    //     tookMs: took,
    //     memoryUsage
    //   })
    //   if (result.getNumRows() > MAX_NUM_ROWS_ON_RESULT || memoryUsage > MAX_MEM_USAGE) {
    //     return { success: null, error: 'calc.messages.error-query-large-memory-usage' }
    //   }
    // }
    return { success: { root: getSerializeValueWithClassName(root), ast, result }, error: null }
  } catch (error) {
    return { success: null, error }
  }
}

type MessageRelalg = {
  type: "exec",
  payload: { text: string, id: string, groupName: string, withResult: boolean }
} | {
  type: "cacheRelations",
  payload: {
    relations: { [name: string]: Relation },
    groupName: string,
  }
}

ctx.addEventListener("message", (event: MessageEvent<MessageRelalg>) => {
  if (!event) return;
  if (event.data.type === "exec") {
    const relations = relationsCache[event.data.payload.groupName];
    const result = execRelalgText(event.data.payload.text, relations || {}, event.data.payload.withResult)
    postMessage({
      ...result,
      id: event.data.payload.id
    });
  }
  if (event.data.type === "cacheRelations") {
    for (const key of Object.keys(event.data.payload.relations)) {
      event.data.payload.relations[key] = deserializeFromParsedObj(event.data.payload.relations[key], classes, {})
    }
    relationsCache[event.data.payload.groupName] = event.data.payload.relations
  }
});