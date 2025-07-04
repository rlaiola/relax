/*** Copyright 2016 Johannes Kessler 2017 Erick Delfin
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// spanish translation was contributed by Erick Delfin https://github.com/Nifled (see https://github.com/dbis-uibk/relax/issues/2)

import { langEN } from 'locales/en';


// cSpell: disable
export const langES: Partial<typeof langEN> = {
  'db.messages.parser.error-duplicate-variable': 'nombre de variable duplicado: {{name}}',
  'db.messages.parser.error-invalid-date-format': '"{{str}}"  no es una fecha válida; formato esperado: YYYY-MM-DD',
  'db.messages.parser.error-group-duplicate-header': 'header duplicado {{name}}',
  'db.messages.parser.error-group-unknown-header': 'header desconocido {{name}}',
  'db.messages.parser.error-group-header-name-missing': 'el nombre del grupo no se ha encontrado (group: ....)',
  'db.messages.parser.error-group-header-name-empty': 'el nombre del grupo debe ser rellenado',
  'db.messages.parser.error-group-non-unique-attribute': 'atributo no único {{name}} en columna {{index}}',
  'db.messages.parser.error-sql-string-use-single-quotes': 'utiliza comillas simples para cadenas de caracteres',
  'db.messages.parser.error-sql-invalid-relation-name': '"{{str}}" no debe ser utilizado como nombre de relacion',
  'db.messages.parser.error-sql-invalid-column-name': '"{{str}}" no debe ser utilizado como nombre de columna',
  'db.messages.parser.error-sql-group-by-missing': 'group by no se encuentra',
  'db.messages.parser.error-sql-having-without-group-by': 'se ha encontrado pero no se encuentra "group by" ó agregación',
  'db.messages.parser.error-sql-negative-limit': 'el límite dado debe ser >= 0',
  'db.messages.parser.error-sqldump-invalid-column-number': 'número inválido de columnas en línea {{line}}',
  'db.messages.parser.error-sqldump-invalid-type': 'tipo inválido en línea {{line}}',
  'db.messages.parser.error-sqldump-insert-wrong-number-columns': 'número de valores != número de columnas',
  'db.messages.parser.error-valueexpr-like-operand-no-string': 'operando derecho de LIKE debe ser una cadena literal',

  'db.messages.exec.error-column-not-unique': 'no se pude agregar columna "{{column}}" por ambiguedad',
  'db.messages.exec.error-column-not-found-name': 'no se pude encontrar columna "{{column}}" en esquema {{schema}}',
  'db.messages.exec.error-column-not-found-index': 'índice de columna "{{column}}" está fuera de rango en equema {{schema}}; index starts at 1',
  'db.messages.exec.error-column-ambiguous': 'columna "{{column}}" es ambigua en esquema {{schema}}',
  'db.messages.exec.error-column-index-out-of-range': 'índice de columna "{{column}}" está fuera de rango en equema {{schema}}; índice comienza en 1',
  'db.messages.exec.error-could-not-change-rel-alias-ambiguity': 'no se pudo establecer relación alias "{{alias}}" por ambiguedad',
  'db.messages.exec.error-could-not-rename-ambiguity': 'no se pudo establecer nuevo nombre "{{newName}}" para "{{oldName}}" por ambiguedad en el equema {{schema}}',
  'db.messages.exec.error-schema-a-not-part-of-schema-b': 'esquema {{schemaA}} no es parte de {{schemaB}}',
  'db.messages.exec.error-schemas-not-unifiable': 'esquemas no son unificables: los tipos son diferentes ó los tamaño son diferentes: {{schemaA}}  y {{schemaB}}',
  'db.messages.exec.error-column-not-in-both-schemas': 'columna "{{column}}" no se puede encontrar en ambos esquemas del join',
  'db.messages.exec.error-condition-must-be-boolean': 'condición debe ser una expresión booleana',
  'db.messages.exec.error-func-not-defined-for-column-type': '{{func}} no está definido para {{colType}}',
  'db.messages.exec.error-join-would-produce-non-unique-columns': 'join resultaría en nombre de columnas no únicos; las siguientes columnas aparecen en ambas relaciones: {{conflicts}}',
  'db.messages.exec.error-no-columns-match-alias-star': 'las columnas no coinciden "{{alias}}.*"',
  'db.messages.exec.error-datatype-not-specified-for-col': 'tipo de dato para columna {{index}} ("{{column}}") no está especificado',
  'db.messages.exec.error-invalid-projection-error': 'proyección inválida "{{argument}}": {{error}}',
  'db.messages.exec.error-function-expects-type': 'función "{{func}}" espera argumentos de tipo "{{expected}}" pero "{{given}}" fue dado',
  'db.messages.exec.error-could-not-compare-different-types': 'no se pudo comparar valor si tipos son diferentes: {{typeA}} != {{typeB}}',
  'db.messages.exec.error-function-expects-arguments-of-same-type': '{{func}} espera que todos los argumentos sean del mismo tipo',
  'db.messages.exec.error-case-when-condition-must-be-boolean': 'la condición de un CASE WHEN debe ser de tipo booleano',
  'db.messages.exec.error-case-when-expects-results-of-same-type': '<i>CASE WHEN condition THEN result END</i> espera todos <i>results<i/> ser del mismo tipo',
  'db.messages.exec.error-invalid-date-format': '"{{str}}"  no es una fecha válido; formato esperado: YYYY-MM-DD',
  'db.messages.exec.error-cast-failed': '"{{expr}}" no se pudo convertir a tipo \"{{type}}"',
  'db.messages.translate.error-relation-not-found': 'no se pudo encontrar relación "{{name}}"',
  'db.messages.translate.warning-distinct-missing': 'DISTINCT está ausente; la algebra relacional utiliza eliminacion de duplicados implícitamente',
  'db.messages.translate.warning-ignored-all-on-set-operators': 'ignorado ALL en operación establecida; la algebra relacional utiliza eliminacion de duplicados implícitamente',
  'db.messages.translate.error-variable-name-conflict': 'conflicto de nombre: nombre de relación "{{name}}" ya existe',
  'db.messages.translate.error-variable-cyclic-usage': 'uso de variable cíclico "{{name}}" detectado',


  'editor.codemirror-placeholder': [
    'tu consulta va aquí ...',
    '',
    'atajos de teclado:',
    '\tejecutar declaración:    [CTRL]+[RETURN]',
    '\ttejecutar selección:    [CTRL]+[SHIFT]+[RETURN]',
    '\tautocompletar:         [CTRL]+[SPACE]',
  ].join('\n'),
  'editor.alert-message-headers.success': 'Éxito',
  'editor.alert-message-headers.info': 'Info',
  'editor.alert-message-headers.warning': 'Advertencia',
  'editor.alert-message-headers.error': 'Error',
  'editor.inline-relation-editor.button-ok': 'ok',
  'editor.inline-relation-editor.button-cancel': 'cancelar',
  'editor.inline-relation-editor.placeholder-column-name-and-types': 'nombreColumna:tipo',
  'editor.inline-relation-editor.enter-your-data': 'por favor ingrese los datos',
  'editor.inline-relation-editor.error-column-name-missing': 'nombre de columna ausente en columna {{index}}',
  'editor.inline-relation-editor.error-wrong-quoted-string': 'cadena de caracteres no debe contener comillas simples y dobles',
  'editor.error-no-query-found': 'no se encontró la consulta',
  'editor.pegjs-error.or': 'ó',
  'editor.pegjs-error.no-input-found': 'no se encontró la entrada',
  'editor.pegjs-error.end-of-input': 'fin de entrada',
  'editor.pegjs-error.expected-found': 'Se esperaba {{expected}} pero se encontró {{found}} .',
  'editor.error-at-line-x': 'en la línea {{line}}',



  'calc.messages.error-query-missing': 'no se encontró la consulta',
  'calc.messages.error-query-missing-assignments-found': 'solo se encontraron asignaciones; a la consulta le falta <a href="help.htm#relalg-assignment" target="_blank">Help - Assignments</a>',
  'calc.messages.gist-load-success': 'gist fue cargado con éxito',
  'calc.menu.headline': 'cargar un Dataset',
  'calc.menu.datasets': 'Datasets',
  'calc.menu.load-gist-headline': 'cargar dataset guardado en un gist',
  'calc.menu.load-gist-button': 'cargar',
  'calc.menu.load-gist-insert-placeholder': 'ID de gist',
	'calc.menu.recently-used': 'Gists utilizados recientemente',
	'calc.menu.create-own-dataset-headline': 'Crear tu propio Dataset',
  'calc.menu.create-own-dataset-text': [
    'Puedes crear tu propio dataset y compartirlo con otras personas. ',
    'Aprende más acerca de ésto en',
  ].join('\n'),
  'calc.menu.create-own-dataset-button-new': 'crear nuevo Dataset',
  'calc.menu.create-own-dataset-button-modify': 'modificar Dataset actual',
  'calc.navigation.take-a-tour': 'Haz un recorrido',
  'calc.navigation.feedback': 'Feedback',
  'calc.navigation.help': 'Ayuda (en)',
  'calc.navigation.language': 'Lenguaje',
  'calc.navigation.calc': 'Calculadora',
  'calc.maintainer-groups.misc': 'Misceláneo',
  'calc.maintainer-groups.temp': 'Temporal',
  'calc.maintainer-groups.uibk': 'Universidad de Innsbruck',
  'calc.maintainer-groups.ufes': 'Universidad Federal de Espírito Santo',
  'calc.maintainer-groups.savben': 'Istituto di Istruzione Superiore Savoia Benincasa',
  'calc.editors.button-history': 'historia',
	'calc.editors.insert-relation-title': 'Insertar',
	'calc.editors.insert-relation-tooltip': 'Insertar nombres de relaciones o columnas',
  'calc.editors.group.tab-name': 'Editor de Grupo',
  'calc.editors.group.tab-name-short': 'EG',
  'calc.editors.group.toolbar.import-sql': 'importar SQL-dump',
  'calc.editors.group.toolbar.import-sql-content': 'importar SQL-dump',
  'calc.editors.group.toolbar.add-new-relation': 'agregar nueva relación',
  'calc.editors.group.toolbar.add-new-relation-content': 'abrir editor de relaciones',
  'calc.editors.group.button-download': 'descargar',
  'calc.editors.group.button-exec': 'vista previa',
  'calc.editors.group.button-use': 'utilizar Grupo en editor',
  'calc.editors.group.button-use_plural': 'utilizar Grupos en editor',
  'calc.editors.group.sql-import-group-name-placeholder': 'Nombre del grupo (importado de SQL)',
  'calc.editors.group.new-group-example-group': '-- éste es un ejemplo\n\ngroup: nombreDeNuevoGrupo \n\n\nA = {\n\ta:string, b:number\n\tejemplo,  42\n}',
  'calc.editors.group.modal-sqldump.modal-title': 'Importar SQL-Dump',
  'calc.editors.group.modal-sqldump.button-close': 'Cerrar',
  'calc.editors.group.modal-sqldump.button-cancel': 'cancelar',
  'calc.editors.group.modal-sqldump.button-import-sql': 'importar SQL',
  'calc.editors.group.modal-sqldump.description': 'Ponga su SQL-Dump aquí para crear un grupo.',

  'calc.editors.ra.tab-name': 'Álgebra Relacional',
  'calc.editors.ra.tab-name-short': 'ÁlgRel',
  'calc.editors.bags.tab-name': 'Álgebra de Multiconjuntos',
  'calc.editors.bags.tab-name-short': 'ÁlgMC',
  'calc.editors.ra.button-execute-query': 'ejecutar consulta',
  'calc.editors.ra.button-execute-selection': 'ejecutar selección',
  'calc.editors.ra.button-download': 'Descargar',
  'calc.editors.ra.button-download-csv': 'Resultado (CSV)',
  'calc.editors.ra.button-download-query': 'Query',
  'calc.editors.ra.button-zoom-in': 'Acercar',
  'calc.editors.ra.button-zoom-out': 'Alejar',
  'calc.editors.ra.button-zoom-reset': 'Restablecer zoom',
  'calc.editors.ra.button-zoom-center': 'Ajustar a la vista',
  'calc.editors.ra.toolbar.duplicate-elimination': 'eliminación de duplicados',
  'calc.editors.ra.toolbar.duplicate-elimination-content': [
    '<b class="math">∂</b> <b>(</b> A <b>)</b>',
    '<br><b>delta</b> A',
  ].join('\n'),
  'calc.editors.ra.toolbar.projection': 'proyección',
  'calc.editors.ra.toolbar.projection-content': [
    '<b class="math">&pi;</b> a, b <b>(</b> A <b>)</b>',
    '<br><b>pi</b> a, b A',
  ].join('\n'),
  'calc.editors.ra.toolbar.selection': 'selección',
  'calc.editors.ra.toolbar.selection-content': [
    '<b class="math">&sigma;</b> a < b ∧ b <span class="math">≠<span> c <b>(</b> A <b>)</b>',
    '<br><b>sigma</b> a < b and b != c A',
  ].join('\n'),
  'calc.editors.ra.toolbar.rename': 'renombrar relación / renombrar columnas',
  'calc.editors.ra.toolbar.rename-content': [
    '<div><span class="math">&sigma;</span> x.a > 1 ( <b class="math">&rho;</b> x <b>(</b> A <b>)</b> )</div>',
    '<div class="math">&sigma; A.y > 2 ( <b class="math">rho</b> y<b class="math">←</b>a <b>(</b> A <b>)</b> )</div>',
  ].join('\n'),
  'calc.editors.ra.toolbar.rename-columns-operator': 'renombrar operador de columnas',
  'calc.editors.ra.toolbar.rename-columns-operator-content': '<div class="math">&sigma; A.y > 2 ( <b>&rho;</b> y<b class="math">←</b>a <b>(</b> A <b>)</b> )</div>',
  'calc.editors.ra.toolbar.orderBy': 'ordenar por',
  'calc.editors.ra.toolbar.orderBy-content': '<div><b class="math">&tau;</b> a asc, [2] desc <b> (</b> A <b>)</b><div><div><b class="math">tau</b> a asc, [2] desc <b> (</b> A <b>)</b></div>',
  'calc.editors.ra.toolbar.groupBy': 'agrupar por',
  'calc.editors.ra.toolbar.groupBy-content': [
    '<div><b class="math">&gamma;</b> a, b<b>;</b> count(c)→c ( A )</div>',
    '<div><b class="math">gamma</b> count(a)->x, sum(b)->y ( A )</div>',
  ].join('\n'),
  'calc.editors.ra.toolbar.and': 'y',
  'calc.editors.ra.toolbar.and-content': '<div><span class="math">&sigma;</span> a < b <b class="math">∧</b> b <span class="math">≠</span> c ( A )</div>',
  'calc.editors.ra.toolbar.xor': 'xor',
  'calc.editors.ra.toolbar.xor-content': '<div><span class="math">&sigma;</span> a < b <b class="math">⊕</b> b <span class="math">≠</span> c ( A )</div>',
  'calc.editors.ra.toolbar.or': 'ó',
  'calc.editors.ra.toolbar.or-content': '<div><span class="math">&sigma;</span> a < b <b class="math">∨</b> b <span class="math">≠</span> c ( A )</div>',
  'calc.editors.ra.toolbar.not': 'no',
  'calc.editors.ra.toolbar.not-content': '<div>&sigma; <b>¬</b>(a < b) ( A )</div>',
  'calc.editors.ra.toolbar.equals': 'igual',
  'calc.editors.ra.toolbar.equals-content': '<div>&sigma; a <b>=</b> b ( A )</div>',
  'calc.editors.ra.toolbar.not-equals': 'no es igual',
  'calc.editors.ra.toolbar.not-equals-content': "<div>&sigma; a <b>≠</b> 'text' ( A )</div>",
  'calc.editors.ra.toolbar.greater-or-equals': 'mayor ó igual',
  'calc.editors.ra.toolbar.greater-or-equals-content': '<div>&sigma; a <b>≥</b> 42 ( A )</div>',
  'calc.editors.ra.toolbar.lesser-or-equals': 'menor ó igual',
  'calc.editors.ra.toolbar.lesser-or-equals-content': '<div>&sigma; a <b>≤</b> 42 ( A )</div>',
  'calc.editors.ra.toolbar.intersect': 'intersecta',
  'calc.editors.ra.toolbar.intersect-content': '<div><b>(</b> A <b>) <span class="math">&cap;</span> (</b> B <b>)</b></div>',
  'calc.editors.ra.toolbar.union': 'unión',
  'calc.editors.ra.toolbar.union-content': '<div><b>(</b> A <b>) <span class="math">&cup;</span> (</b> B <b>)</b></div>',
  'calc.editors.ra.toolbar.division': 'división',
  'calc.editors.ra.toolbar.division-content': '<div><b>(</b> A <b>) ÷ (</b> B <b>)</b></div>',
  'calc.editors.ra.toolbar.subtraction': 'resta',
  'calc.editors.ra.toolbar.subtraction-content': [
    '<div><b>(</b> A <b>) - (</b> B <b>)</b></div>',
    '<div><b>(</b> A <b>) \\ (</b> B <b>)</b></div>',
  ].join('\n'),
  'calc.editors.ra.toolbar.cross-join': 'cross join (cruzado)',
  'calc.editors.ra.toolbar.cross-join-content': '<div><b>(</b> A <b>) <b class="math">⨯</b> (</b> B <b>)</b></div>',
  'calc.editors.ra.toolbar.natural-join': 'natural join / θ-join',
  'calc.editors.ra.toolbar.natural-join-content': [
    '<div><b>(</b> A <b>) <b class="math">⋈</b> (</b> B <b>)</b></div>',
    '<div><b>(</b> A <b class="math">) ⋈ A.a ≥ B.a (</b> B <b>)</b></div>',
  ].join('\n'),
  'calc.editors.ra.toolbar.left-outer-join': 'left outer join',
  'calc.editors.ra.toolbar.left-outer-join-content': [
    '<div><b>(</b> A <b class="math">) ⟕ (</b> B <b>)</b></div>',
    '<div><b>(</b> A <b class="math">) ⟕ A.a < B.a (</b> B <b>)</b></div>',
  ].join('\n'),
  'calc.editors.ra.toolbar.right-outer-join': 'right outer join',
  'calc.editors.ra.toolbar.right-outer-join-content': [
    '<div><b>(</b> A <b class="math">) ⟖ (</b> B <b>)</b></div>',
    '<div><b>(</b> A <b class="math">) ⟖ A.a < B.a (</b> B <b>)</b></div>',
  ].join('\n'),
  'calc.editors.ra.toolbar.full-outer-join': 'full outer join',
  'calc.editors.ra.toolbar.full-outer-join-content': [
    '<div><b>(</b> A <b class="math">) ⟗ (</b> B <b>)</b></div>',
    '<div><b>(</b> A <b class="math">) ⟗ A.a != B.a (</b> B <b>)</b></div>',
  ].join('\n'),
  'calc.editors.ra.toolbar.left-semi-join': 'left semi join',
  'calc.editors.ra.toolbar.left-semi-join-content': '<div><b>(</b> A <b class="math">) ⋉ (</b> B <b>)</b></div>',
  'calc.editors.ra.toolbar.right-semi-join': 'right semi join',
  'calc.editors.ra.toolbar.right-semi-join-content': '<div><b>(</b> A <b class="math">) ⋊ (</b> B <b>)</b></div>',
  'calc.editors.ra.toolbar.anti-join': 'anti join',
  'calc.editors.ra.toolbar.anti-join-content': '<div><b>(</b> A <b class="math">) ▷ (</b> B <b>)</b></div>',
  'calc.editors.ra.toolbar.assignment': 'asignación',
  'calc.editors.ra.toolbar.assignment-content': [
    '<div><b>X = </b> pi a ( A )',
    '<br /><b>Y = </b> pi b ( b )',
    '<br />( X ) <span class="math">&cup;</span> ( Y )<br /></div>',
  ].join('\n'),
  'calc.editors.ra.toolbar.single-line-comment': 'comentario de una línea',
  'calc.editors.ra.toolbar.single-line-comment-content': '<span class="math">&pi;</span> a, b A <b>-- useful comment</b>',
  'calc.editors.ra.toolbar.multi-line-comment': 'comentario de múltiples líneas',
  'calc.editors.ra.toolbar.multi-line-comment-content': '<b>/* this is a very,<br>very long comment */</b><br><span class="math">&pi;</span> a, b A',
  'calc.editors.ra.toolbar.inline-relation': 'inline-relation',
  'calc.editors.ra.toolbar.inline-relation-content': "&sigma; a = 'test' (<b>{<br>a:string, b:number, X.c:date<br>a, 1, 1970-01-01<br>}</b>)",
  'calc.editors.ra.toolbar.inline-relation-editor': 'inline-relation (editor)',
  'calc.editors.ra.toolbar.inline-relation-editor-content': 'crear nuevo inline-relation utilizando editor incorporado',
  'calc.editors.ra.toolbar.insert-date': 'insertar fecha',


  'calc.editors.sql.tab-name': 'SQL',
  'calc.editors.sql.tab-name-short': 'SQL',
  'calc.editors.sql.button-execute-query': 'ejecutar consulta',
  'calc.editors.sql.button-execute-selection': 'ejecutar selección',
  'calc.editors.sql.button-download': 'descargar',
  'calc.editors.sql.toolbar.select': 'seleccionar cláusula',
  'calc.editors.sql.toolbar.select-content': '<p>SELECT * FROM A</p><div>SELECT a, A.b, A.c FROM A</div>',
  'calc.editors.sql.toolbar.from': 'cláusula from (desde)',
  'calc.editors.sql.toolbar.from-content': '<div>SELECT * <br>FROM A, B as b<br>INNER JOIN C NATURAL</div>',
  'calc.editors.sql.toolbar.where': 'cláusula where (donde)',
  'calc.editors.sql.toolbar.where-content': 'SELECT * FROM A, B <br>where A.a = B.a or false',
  'calc.editors.sql.toolbar.group-by': 'cláusula agrupar por',
  'calc.editors.sql.toolbar.group-by-content': 'SELECT a, COUNT(b) as num <br>FROM A <br>GROUP BY a',
  'calc.editors.sql.toolbar.having': 'teniendo cláusula',
  'calc.editors.sql.toolbar.having-content': 'SELECT a, SUM(b) as sum <br>FROM A <br>GROUP BY a<br>having sum > 10',
  'calc.editors.sql.toolbar.order-by': 'cláusula ordenar por',
  'calc.editors.sql.toolbar.order-by-content': '<p>SELECT * FROM A ORDER BY a asc, b desc</p><div>SELECT * FROM A ORDER BY 1, 2, 3</div>',
  'calc.editors.sql.toolbar.limit': 'cláusula límite',
  'calc.editors.sql.toolbar.limit-content': 'SELECT * FROM A <br>LIMIT 10 OFFSET 0',
  'calc.editors.sql.toolbar.insert-date': 'insertar fecha',


  'calc.tour.welcome': 'Bienvenido a RelaX, la calculadora de álgebra relacional',
  'calc.tour.choose-dataset-here': 'puedes elegir tu dataset aquí',
  'calc.tour.currently-loaded-datasets': 'éstos son los dataset qeu están cargados actualmente',
  'calc.tour.load-dataset-via-gist': '<p>también puedes cargar un dataset que fue compartido desde un <a href="https://gist.github.com/" target="_blank">GitHub Gist</a></p>',
  'calc.tour.relation-attributes': 'aquí están los atributos de cada relación y su tipo de dato<br>sólo dale click para agregarlas al editor',
  'calc.tour.ra-toolbar': 'los operadores de relación pueden ser insertados aquí<br>o puedes usar el <a href="help.htm#tutorial-user-plain-text-notation" target="_blank">síntaxis alternativa</a>',
  'calc.tour.ra-statement-goes-here': 'la declaración de álgebra relacional va aquí',
  'calc.tour.ra-example-query': 'éste es un ejemplo de una declaración en una proyección, selección y join natural',
  'calc.tour.ra-example-query-plaintext': 'éste es el mismo ejemplo utilizando la <a href="help.htm#tutorial-user-plain-text-notation" target="_blank">síntaxis alternativa de texto simple</a>',
  'calc.tour.ra-example-execute-it': 'vamos a ejecutarlo para ver el resultado',
  'calc.tour.ra-example-result': 'ésta es la declaración actual y el resultado',
  'calc.tour.ra-example-operator-tree': '<p>éste es el árbol de operadores de la declaración de álgebra relacional.</p><p>Puedes darle click a cada nodo para obtener el resultado intermediario.</p>',
  'calc.tour.switch-to-sql': '<p>también puedes cambiarte al editor de SQL</p>',
  'calc.tour.sql-example-query': 'éste es la declaración de ejemplo que utilizamos anteriormente, ésta vez en SQL',
  'calc.tour.sql-example-execute-it': 'vamos a ejecutarlo para ver el resultado',
  'calc.tour.sql-example-result': '<p>la declaración de SQL se traduce a álgebra relacional y puedes ver el árbol de operadores, la fórmula relacional y el resultado.</p>',
  'calc.tour.end': [
    '<p>Ya debes saber lo más básico de la herramienta.</p><p>Puedes encontrar más información en ',
    '<a href="help.htm" target="_blank">página de ayuda</a> like:',
    '</p><ul>',
    '<li><a href="help.htm#tutorial-user" target="_blank">un tutorial para usuarios explicando los básicos</a></li>',
    '<li><a href="help.htm#relalg-reference" target="_blank">una referencia completa de los operadores relacionales soportados y la síntaxis utilizada</a></li>',
    '<li><a href="help.htm#relalg-reference" target="_blank">una referencia completa del subconjunto SQL soportado y la síntaxis</a></li>',
    '<li><a href="help.htm#tutorial-maintainer" target="_blank">un breve tutorial de como hacer tu propio dataset para compartir con otros</a></li>',
    '</ul>',
  ].join('\n'),
  'calc.result.modal.title': 'Resultado',
  'calc.result.modal.close': 'Cerrar',
	'calc.editors.ra.inline-editor.title': 'Editor de relaciones',
	'calc.editors.ra.inline-editor.button-download-csv': 'Descargar CSV',
	'calc.editors.ra.inline-editor.button-upload-csv': 'Subir CSV',
  'calc.editors.ra.inline-editor.button-cancel': 'Cancelar',
	'calc.editors.ra.inline-editor.button-ok': 'Ok',
	'calc.editors.ra.inline-editor.row-name': 'Nombre',
	'calc.editors.ra.inline-editor.row-type': 'Escriba',
	'calc.editors.ra.inline-editor.input-relation-name': 'Nombre de la relación',
	'calc.result.exec.time': 'Tiempo de consulta',
	'local.change': '¿Recargar la página para cambiar el idioma?',
};
