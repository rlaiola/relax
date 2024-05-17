/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const langEN = {
	'db.messages.parser.error-duplicate-variable': 'duplicate variable name: {{name}}',
	'db.messages.parser.error-invalid-date-format': '"{{str}}"  is not a valid date; expected format: YYYY-MM-DD',
	'db.messages.parser.error-group-duplicate-header': 'duplicate header {{name}}',
	'db.messages.parser.error-group-unknown-header': 'unknown header {{name}}',
	'db.messages.parser.error-group-header-name-missing': 'the name of the group is missing (group: ....)',
	'db.messages.parser.error-group-header-name-empty': 'the name of the group must not be empty',
	'db.messages.parser.error-group-non-unique-attribute': 'non unique attribute {{name{{ in column }}index}}',
	'db.messages.parser.error-group-non-unique-group-name': 'duplicate group name: {{name}}',
	'db.messages.parser.error-sql-string-use-single-quotes': 'use single quotes for strings',
	'db.messages.parser.error-sql-invalid-relation-name': '"{{str}}" must not be used as a relation-name',
	'db.messages.parser.error-sql-invalid-column-name': '"{{str}}" must not be used as a column-name',
	'db.messages.parser.error-sql-group-by-missing': 'group by is missing',
	'db.messages.parser.error-sql-having-without-group-by': 'having found but missing "group by" or aggregation',
	'db.messages.parser.error-sql-negative-limit': 'the limit given must be >= 0',
	'db.messages.parser.error-sqldump-invalid-column-number': 'invalid number of columns in line {{line}}',
	'db.messages.parser.error-sqldump-invalid-type': 'invalid type in line  {{line}}',
	'db.messages.parser.error-sqldump-insert-wrong-number-columns': 'number of values != number of columns',
	'db.messages.parser.error-valueexpr-like-operand-no-string': 'right operand of LIKE must be a string literal',
	'db.messages.exec.error-column-not-unique': 'could not add column "{{column}}" because of ambiguity',
	'db.messages.exec.error-column-not-found-name': 'could not find column "{{column{{" in schema }}schema}}',
	'db.messages.exec.error-column-not-found-index': 'column index "{{column{{" is out of range in schema }}schema}}; index starts at 1',
	'db.messages.exec.error-column-ambiguous': 'column "{{column{{" is ambiguous in schema }}schema}}',
	'db.messages.exec.error-column-index-out-of-range': 'column index "{{column{{" is out of range in schema }}schema}}; index starts at 1',
	'db.messages.exec.error-could-not-change-rel-alias-ambiguity': 'could not set relation alias "{{alias}}" because of ambiguity',
	'db.messages.exec.error-could-not-rename-ambiguity': 'could not set new name "{{newName{{" for "{{oldName}}" because of ambiguity in schema }}schema}}',
	'db.messages.exec.error-schema-a-not-part-of-schema-b': 'schema {{schemaA{{ is not part of }}schemaB}}',
	'db.messages.exec.error-schemas-not-unifiable': 'schemas are not unifiable: types are different or size is different: {{schemaA{{  and }}schemaB}}',
	'db.messages.exec.error-column-not-in-both-schemas': 'column "{{column}}" can not be found in both schemas of join',
	'db.messages.exec.error-condition-must-be-boolean': 'condition must be a boolean expression',
	'db.messages.exec.error-func-not-defined-for-column-type': '{{func{{ not defined for type }}colType}}',
	'db.messages.exec.error-join-would-produce-non-unique-columns': 'join would result in non unique column names; the following columns appear in both relations: {{conflicts}}',
	'db.messages.exec.error-no-columns-match-alias-star': 'no columns match "{{alias}}.*"',
	'db.messages.exec.error-datatype-not-specified-for-col': 'datatype for column {{index{{ ("}}column}}") is not specified',
	'db.messages.exec.error-invalid-projection-error': 'invalid projection "{{argument{{": }}error}}',
	'db.messages.exec.error-function-expects-type': 'function "{{func{{" expects arguments of type "{{expected}}" but "}}given}}" given',
	'db.messages.exec.error-could-not-compare-different-types': 'could not compare value if types are different: {{typeA{{ != }}typeB}}',
	'db.messages.exec.error-function-expects-arguments-of-same-type': '{{func}} expects all arguments to be of the same type',
	'db.messages.exec.error-case-when-condition-must-be-boolean': 'the condition of a CASE WHEN must be of type boolean',
	'db.messages.exec.error-case-when-expects-results-of-same-type': '<i>CASE WHEN condition THEN result END</i> expects all <i>results<i/> to be of the same type',
	'db.messages.exec.error-invalid-date-format': '"{{str}}"  is not a valid date; expected format: YYYY-MM-DD',
	'db.messages.translate.error-relation-not-found': 'could not find relation "{{name}}"',
	'db.messages.translate.warning-distinct-missing': 'DISTINCT is missing; relational algebra uses implicit duplicate elimination',
	'db.messages.translate.warning-ignored-all-on-set-operators': 'ignored ALL on set operation; relational algebra uses implicit duplicate elimination',
	'db.messages.translate.error-variable-name-conflict': 'name conflict: relation name "{{name}}" already exists',
	'db.messages.translate.error-variable-cyclic-usage': 'cyclic usage of variable "{{name}}" detected',


	'editor.codemirror-placeholder': [
		'your query goes here ...',
		'',
		'keyboard shortcuts:',
		'\texecute statement:    [CTRL]+[RETURN]',
		'\texecute selection:    [CTRL]+[SHIFT]+[RETURN]',
		'\tautocomplete:         [CTRL]+[SPACE]',
	].join('\n'),
	'editor.alert-message-headers.success': 'Success',
	'editor.alert-message-headers.info': 'Info',
	'editor.alert-message-headers.warning': 'Warning',
	'editor.alert-message-headers.error': 'Error',
	'editor.inline-relation-editor.button-ok': 'ok',
	'editor.inline-relation-editor.button-cancel': 'cancel',
	'editor.inline-relation-editor.placeholder-column-name-and-types': 'columnName:type',
	'editor.inline-relation-editor.enter-your-data': 'please enter your data',
	'editor.inline-relation-editor.error-column-name-missing': 'column name missing in column {{index}}',
	'editor.inline-relation-editor.error-wrong-quoted-string': 'string must not contain single and double quotes',
	'editor.error-no-query-found': 'no query found',
	'editor.pegjs-error.or': 'or',
	'editor.pegjs-error.no-input-found': 'no input found',
	'editor.pegjs-error.end-of-input': 'end of input',
	'editor.pegjs-error.expected-found': 'Expected {{expected}} but {{found}} found.',
	'editor.error-at-line-x': 'at line {{line}}',


	'calc.messages.error-query-missing': 'no query found',
	'calc.messages.error-query-missing-assignments-found': 'only assignments found; query is missing <a href="help.htm#relalg-assignment" target="_blank">Help - Assignments</a>',
	'calc.messages.gist-load-success': 'gist loaded successfully',
	'calc.menu.headline': 'Load a Dataset',
	'calc.menu.datasets': 'Datasets',
	'calc.menu.load-gist-headline': 'Load dataset stored in a gist',
	'calc.menu.load-gist-button': 'load',
	'calc.menu.load-gist-insert-placeholder': 'gist ID',
	'calc.menu.recently-used': 'Recently used gists',
	'calc.menu.create-own-dataset-headline': 'Create your own Dataset',
	'calc.menu.create-own-dataset-text': 'You can create your own dataset and share it with others. Learn more about it in the ',
	'calc.menu.create-own-dataset-text-link': 'Maintainer Tutorial',
	'calc.menu.create-own-dataset-button-new': 'create new Dataset',
	'calc.menu.create-own-dataset-button-modify': 'modify current Dataset',
	'calc.navigation.take-a-tour': 'Take a Tour',
	'calc.navigation.feedback': 'Feedback',
	'calc.navigation.help': 'Help',
	'calc.navigation.calc': 'Calculate',
	'calc.navigation.language': 'Language',
	'calc.maintainer-groups.misc': 'Miscellaneous',
	'calc.maintainer-groups.temp': 'Temporary',
	'calc.maintainer-groups.uibk': 'University of Innsbruck',
	'calc.maintainer-groups.ufes': 'Federal University of Espírito Santo',
	'calc.editors.button-history': 'history',
	'calc.editors.insert-relation-title': 'Insert',
	'calc.editors.insert-relation-tooltip': 'Insert relation or column names',
	'calc.editors.group.tab-name': 'Group Editor',
	'calc.editors.group.tab-name-short': 'GE',
	'calc.editors.group.toolbar.import-sql': 'import SQL-dump',
	'calc.editors.group.toolbar.import-sql-content': 'import SQL-dump',
	'calc.editors.group.toolbar.add-new-relation': 'add new relation',
	'calc.editors.group.toolbar.add-new-relation-content': 'open relation editor',
	'calc.editors.group.button-download': 'download',
	'calc.editors.group.button-exec': 'preview',
	'calc.editors.group.button-use': 'use Group in editor',
	'calc.editors.group.button-use_plural': 'use first Group in editor',
	'calc.editors.group.sql-import-group-name-placeholder': 'Name of the group (imported from SQL)',
	'calc.editors.group.new-group-example-group': '-- this is an example\n\ngroup: nameOfTheNewGroup \n\n\nA = {\n\ta:string, b:number\n\texample,  42\n}',
	'calc.editors.group.modal-sqldump.modal-title': 'Import SQL-Dump',
	'calc.editors.group.modal-sqldump.button-close': 'Close',
	'calc.editors.group.modal-sqldump.button-cancel': 'cancel',
	'calc.editors.group.modal-sqldump.button-import-sql': 'import SQL',
	'calc.editors.group.modal-sqldump.description': 'Put your SQL-Dump here to create a group.',
	'calc.editors.ra.tab-name': 'Relational Algebra',
	'calc.editors.ra.tab-name-short': 'RelAlg',
	'calc.editors.bags.tab-name': 'Multiset Algebra',
	'calc.editors.bags.tab-name-short': 'BagAlg',
	'calc.editors.ra.button-execute-query': 'execute query',
	'calc.editors.ra.button-execute-selection': 'execute selection',
	'calc.editors.ra.button-download': 'Download CSV',
	'calc.editors.ra.button-download-csv': 'Result (CSV)',
	'calc.editors.ra.button-download-jpg': 'Result (JPG)',
	'calc.editors.ra.button-download-query': 'Query',
	'calc.editors.ra.toolbar.duplicate-elimination': 'duplicate elimination',
  'calc.editors.ra.toolbar.duplicate-elimination-content': [
    '<b class="math">&delta;</b> <b>(</b> A <b>)</b>',
    '<br><b>delta</b> A',
  ].join('\n'),
	'calc.editors.ra.toolbar.projection': 'projection',
	'calc.editors.ra.toolbar.projection-content': `
		<b class=\"math\">&pi;</b> a, b <b>(</b> A <b>)</b>
		<br><b>pi</b> a, b A
	`,
	'calc.editors.ra.toolbar.selection': 'selection',
	'calc.editors.ra.toolbar.selection-content': `
		<b class=\"math\">&sigma;</b> a < b ∧ b <span class=\"math\">≠<span> c <b>(</b> A <b>)</b>
		<br><b>sigma</b> a < b and b != c A
	`,
	'calc.editors.ra.toolbar.rename': 'rename relation / rename columns',
	'calc.editors.ra.toolbar.rename-content': `
		<div><span class=\"math\">&sigma;</span> x.a > 1 ( <b class=\"math\">&rho;</b> x <b>(</b> A <b>)</b> )</div>
		<div class=\"math\">&sigma; A.y > 2 ( <b class=\"math\">rho</b> y<b class=\"math\">←</b>a <b>(</b> A <b>)</b> )</div>
	`,
	'calc.editors.ra.toolbar.rename-columns-operator': 'rename columns operator',
	'calc.editors.ra.toolbar.rename-columns-operator-content': '<div class="math">&sigma; A.y > 2 ( <b>&rho;</b> y<b class="math">←</b>a <b>(</b> A <b>)</b> )</div>',
	'calc.editors.ra.toolbar.orderBy': 'order by',
	'calc.editors.ra.toolbar.orderBy-content': '<div><b class="math">&tau;</b> a asc, [2] desc <b> (</b> A <b>)</b><div><div><b class="math">tau</b> a asc, [2] desc <b> (</b> A <b>)</b></div>',
	'calc.editors.ra.toolbar.groupBy': 'group by',
	'calc.editors.ra.toolbar.groupBy-content': `
		<div><b class=\"math\">&gamma;</b> a, b<b>;</b> count(c)→c ( A )</div>
		<div><b class=\"math\">gamma</b> count(a)->x, sum(b)->y ( A )</div>
	`,
	'calc.editors.ra.toolbar.and': 'and',
	'calc.editors.ra.toolbar.and-content': '<div><span class="math">&sigma;</span> a < b <b class="math">∧</b> b <span class="math">≠</span> c ( A )</div>',
	'calc.editors.ra.toolbar.xor': 'xor',
	'calc.editors.ra.toolbar.xor-content': '<div><span class="math">&sigma;</span> a < b <b class="math">⊕</b> b <span class="math">≠</span> c ( A )</div>',
	'calc.editors.ra.toolbar.or': 'or',
	'calc.editors.ra.toolbar.or-content': '<div><span class="math">&sigma;</span> a < b <b class="math">∨</b> b <span class="math">≠</span> c ( A )</div>',
	'calc.editors.ra.toolbar.not': 'not',
	'calc.editors.ra.toolbar.not-content': '<div>&sigma; <b>¬</b>(a < b) ( A )</div>',
	'calc.editors.ra.toolbar.equals': 'equals',
	'calc.editors.ra.toolbar.equals-content': '<div>&sigma; a <b>=</b> b ( A )</div>',
	'calc.editors.ra.toolbar.not-equals': 'not equals',
	'calc.editors.ra.toolbar.not-equals-content': "<div>&sigma; a <b>≠</b> 'text' ( A )</div>",
	'calc.editors.ra.toolbar.greater-or-equals': 'greater or equals',
	'calc.editors.ra.toolbar.greater-or-equals-content': '<div>&sigma; a <b>≥</b> 42 ( A )</div>',
	'calc.editors.ra.toolbar.lesser-or-equals': 'lesser or equals',
	'calc.editors.ra.toolbar.lesser-or-equals-content': '<div>&sigma; a <b>≤</b> 42 ( A )</div>',
	'calc.editors.ra.toolbar.intersect': 'intersect',
	'calc.editors.ra.toolbar.intersect-content': '<div><b>(</b> A <b>) <span class="math">&cap;</span> (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.union': 'union',
	'calc.editors.ra.toolbar.union-content': '<div><b>(</b> A <b>) <span class="math">&cup;</span> (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.division': 'division',
	'calc.editors.ra.toolbar.division-content': '<div><b>(</b> A <b>) ÷ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.subtraction': 'subtraction',
	'calc.editors.ra.toolbar.subtraction-content': `
		<div><b>(</b> A <b>) - (</b> B <b>)</b></div>
		<div><b>(</b> A <b>) \\ (</b> B <b>)</b></div>
	`,
	'calc.editors.ra.toolbar.cross-join': 'cross join',
	'calc.editors.ra.toolbar.cross-join-content': '<div><b>(</b> A <b>) <b class="math">⨯</b> (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.natural-join': 'natural join / θ-join',
	'calc.editors.ra.toolbar.natural-join-content': `
		<div><b>(</b> A <b>) <b class=\"math\">⋈</b> (</b> B <b>)</b></div>
		<div><b>(</b> A <b class=\"math\">) ⋈ A.a ≥ B.a (</b> B <b>)</b></div>
	`,
	'calc.editors.ra.toolbar.left-outer-join': 'left outer join',
	'calc.editors.ra.toolbar.left-outer-join-content': `
		<div><b>(</b> A <b class=\"math\">) ⟕ (</b> B <b>)</b></div>
		<div><b>(</b> A <b class=\"math\">) ⟕ A.a < B.a (</b> B <b>)</b></div>
	`,
	'calc.editors.ra.toolbar.right-outer-join': 'right outer join',
	'calc.editors.ra.toolbar.right-outer-join-content': `
		<div><b>(</b> A <b class=\"math\">) ⟖ (</b> B <b>)</b></div>
		<div><b>(</b> A <b class=\"math\">) ⟖ A.a < B.a (</b> B <b>)</b></div>
	`,
	'calc.editors.ra.toolbar.full-outer-join': 'full outer join',
	'calc.editors.ra.toolbar.full-outer-join-content': `
		<div><b>(</b> A <b class=\"math\">) ⟗ (</b> B <b>)</b></div>
		<div><b>(</b> A <b class=\"math\">) ⟗ A.a != B.a (</b> B <b>)</b></div>
	`,
	'calc.editors.ra.toolbar.left-semi-join': 'left semi join',
	'calc.editors.ra.toolbar.left-semi-join-content': '<div><b>(</b> A <b class="math">) ⋉ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.right-semi-join': 'right semi join',
	'calc.editors.ra.toolbar.right-semi-join-content': '<div><b>(</b> A <b class="math">) ⋊ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.anti-join': 'anti join',
	'calc.editors.ra.toolbar.anti-join-content': '<div><b>(</b> A <b class="math">) ▷ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.assignment': 'assignment',
	'calc.editors.ra.toolbar.assignment-content': `
		<div><b>X = </b> pi a ( A )
		<br /><b>Y = </b> pi b ( b )
		<br />( X ) <span class=\"math\">&cup;</span> ( Y )<br /></div>
	`,
	'calc.editors.ra.toolbar.single-line-comment': 'single-line comment',
	'calc.editors.ra.toolbar.single-line-comment-content': '<span class="math">&pi;</span> a, b A <b>-- useful comment</b>',
	'calc.editors.ra.toolbar.multi-line-comment': 'multi-line comment',
	'calc.editors.ra.toolbar.multi-line-comment-content': '<b>/* this is a very,<br>very long comment */</b><br><span class="math">&pi;</span> a, b A',
	'calc.editors.ra.toolbar.inline-relation': 'inline-relation',
	'calc.editors.ra.toolbar.inline-relation-content': "&sigma; a = 'test' (<b>{<br>a:string, b:number, X.c:date<br>a, 1, 1970-01-01<br>}</b>)",
	'calc.editors.ra.toolbar.inline-relation-editor': 'inline-relation (editor)',
	'calc.editors.ra.toolbar.inline-relation-editor-content': 'create a new inline-relation using a built in editor',
	'calc.editors.ra.toolbar.insert-date': 'insert date',
	'calc.editors.ra.toolbar.insert-date-content': "<span class=\"math\">&sigma;</span> a &lt; <b>date('1970-01-01')</b> ( A )",
	'calc.editors.ra.toolbar.autoreplace-operators.title': 'operator replacement',
	'calc.editors.ra.toolbar.autoreplace-operators.header': 'automatically replace operators',
	'calc.editors.ra.toolbar.autoreplace-operators.none': 'no replacement',
	'calc.editors.ra.toolbar.autoreplace-operators.plain2math': 'pi => π',
	'calc.editors.ra.toolbar.autoreplace-operators.math2plain': 'π => pi',
	'calc.editors.sql.tab-name': 'SQL',
	'calc.editors.sql.tab-name-short': 'SQL',
	'calc.editors.sql.button-execute-query': 'execute query',
	'calc.editors.sql.button-execute-selection': 'execute selection',
	'calc.editors.sql.button-download': 'download',
	'calc.editors.sql.toolbar.select': 'select clause',
	'calc.editors.sql.toolbar.select-content': '<p>SELECT * FROM A</p><div>SELECT a, A.b, A.c FROM A</div>',
	'calc.editors.sql.toolbar.from': 'from clause',
	'calc.editors.sql.toolbar.from-content': '<div>SELECT * <br>FROM A, B as b<br>INNER JOIN C NATURAL</div>',
	'calc.editors.sql.toolbar.where': 'where  clause',
	'calc.editors.sql.toolbar.where-content': 'SELECT * FROM A, B <br>where A.a = B.a or false',
	'calc.editors.sql.toolbar.group-by': 'group by clause',
	'calc.editors.sql.toolbar.group-by-content': 'SELECT a, COUNT(b) as num <br>FROM A <br>GROUP BY a',
	'calc.editors.sql.toolbar.having': 'having  clause',
	'calc.editors.sql.toolbar.having-content': 'SELECT a, SUM(b) as sum <br>FROM A <br>GROUP BY a<br>having sum > 10',
	'calc.editors.sql.toolbar.order-by': 'order by  clause',
	'calc.editors.sql.toolbar.order-by-content': '<p>SELECT * FROM A ORDER BY a asc, b desc</p><div>SELECT * FROM A ORDER BY 1, 2, 3</div>',
	'calc.editors.sql.toolbar.limit': 'limit clause',
	'calc.editors.sql.toolbar.limit-content': 'SELECT * FROM A <br>LIMIT 10 OFFSET 0',
	'calc.editors.sql.toolbar.insert-date': 'insert date',
	'calc.editors.sql.toolbar.insert-date-content': `
		select * from A
		where a &lt; <b>date('1970-01-01')</b>
	`,
	'calc.tour.welcome': 'Welcome to RelaX, the relational algebra calculator',
	'calc.tour.choose-dataset-here': 'you can choose your dataset here',
	'calc.tour.currently-loaded-datasets': 'these are the currently loaded datasets',
	'calc.tour.load-dataset-via-gist': '<p>you can also load a dataset that was shared via a <a href="https://gist.github.com/" target="_blank">GitHub Gist</a></p>',
	'calc.tour.relation-attributes': 'here are the attributes of each relation and their datatype<br>just click to add them to the editor',
	'calc.tour.ra-toolbar': 'the relalg operators can be inserted here<br>or you can use the <a href="help.htm#tutorial-user-plain-text-notation" target="_blank">alternative syntax</a>',
	'calc.tour.ra-statement-goes-here': 'the relational algebra statement goes here',
	'calc.tour.ra-example-query': 'this is a simple example statement using a projection, selection and a natural join',
	'calc.tour.ra-example-query-plaintext': 'this is the very same example using the <a href="help.htm#tutorial-user-plain-text-notation" target="_blank">alternative plaintext syntax</a>',
	'calc.tour.ra-example-execute-it': 'lets execute it to see the result',
	'calc.tour.ra-example-result': 'this is the current statement and the actual result',
	'calc.tour.ra-example-operator-tree': '<p>this is the operator tree of the relational algebra statement.</p><p>You can click on every node to get the intermediate result.</p>',
	'calc.tour.switch-to-sql': '<p>you can also switch to the SQL editor</p>',
	'calc.tour.sql-example-query': 'this is the example statement you saw before, this time in SQL',
	'calc.tour.sql-example-execute-it': 'lets execute it to see the result',
	'calc.tour.sql-example-result': '<p>the SQL-statement gets translated into relational algebra and you can see the operator-tree, the relalg formula and the result.</p>',
	'calc.tour.end': `
		<p>You should now know the very basics of the tool.</p><p>You can find more information on the 
		<a href=\"help.htm\" target=\"_blank\">Help page</a> like:
		</p><ul>
		<li><a href=\"help.htm#tutorial-user\" target=\"_blank\">a short tutorial for users explaining the basics</a></li>
		<li><a href=\"help.htm#relalg-reference\" target=\"_blank\">a complete reference of the supported relalg operators and the used syntax</a></li>
		<li><a href=\"help.htm#relalg-reference\" target=\"_blank\">a complete reference of the supported SQL subset and the supported syntax</a></li>
		<li><a href=\"help.htm#tutorial-maintainer\" target=\"_blank\">a short tutorial about how to create a new dataset for others</a></li>
		</ul>
	`,
	'calc.result.modal.title': 'Result',
	'calc.result.modal.close': 'Close',
	'calc.editors.ra.inline-editor.title': 'Relation Editor',
	'calc.editors.ra.inline-editor.button-download-csv': 'Download CSV',
	'calc.editors.ra.inline-editor.button-upload-csv': 'Upload CSV',
	'calc.editors.ra.inline-editor.button-cancel': 'Cancel',
	'calc.editors.ra.inline-editor.button-ok': 'Ok',
	'calc.editors.ra.inline-editor.row-name': 'Name',
	'calc.editors.ra.inline-editor.row-type': 'Type',
	'calc.editors.ra.inline-editor.input-relation-name': 'Relation Name',
	'calc.result.exec.time': 'Execution Time: ',
	'local.change': 'Reload page to change language?',
};
