export const langKR = {
	'db.messages.parser.error-duplicate-variable': '변수 이름 중복: {{name}}',
	'db.messages.parser.error-invalid-date-format': '"__str__"  유효하지 않은 날짜; 형식: YYYY-MM-DD',
	'db.messages.parser.error-group-duplicate-header': ' 헤더 중복: {{name}}',
	'db.messages.parser.error-group-unknown-header': '알 수 없는 헤더:  {{name}}',
	'db.messages.parser.error-group-header-name-missing': '그룹 이름이 없음(group: ....)',
	'db.messages.parser.error-group-header-name-empty': '그룹 이름은 비어있으면 안됨',
	'db.messages.parser.error-group-non-unique-attribute': '__index__ 열에서 고유하지 않은 속성 {{name}}',
	'db.messages.parser.error-sql-string-use-single-quotes': '문자열에 작은 따음표 사용',
	'db.messages.parser.error-sql-invalid-relation-name': '"__str__"은 관계 이름으로 사용 할 수 없음',
	'db.messages.parser.error-sql-invalid-column-name': '"__str__"은 열 이름으로 사용할 수 없음',
	'db.messages.parser.error-sql-group-by-missing': 'group by 없음',
	'db.messages.parser.error-sql-having-without-group-by': '"group by" 또는 집계 없음',
	'db.messages.parser.error-sql-negative-limit': '0 이상이어야 함',
	'db.messages.parser.error-sqldump-invalid-column-number': '__line__ 에서 유효하지 않은 열',
	'db.messages.parser.error-sqldump-invalid-type': '__line__ 에서 유효하지 않은 타입',
	'db.messages.parser.error-sqldump-insert-wrong-number-columns': '값의 숫자 !=  열의 숫자',
	'db.messages.parser.error-valueexpr-like-operand-no-string': 'LIKE의 오른쪽 피연산자는 문자열 리터럴이어야 함',
	'db.messages.exec.error-column-not-unique': '모호성 때문에 열 "__column__" 을 추가할 수 없음',
	'db.messages.exec.error-column-not-found-name': '스키마 __schema__ 에서 열 "__column__" 을 찾을 수 없음',
	'db.messages.exec.error-column-not-found-index': '열 인덱스  "__column__" 는 범위를 벗어남; 인덱스는 1에서 시작',
	'db.messages.exec.error-column-ambiguous': '열 "__column__" 는 스키마  __schema__ 에서 모호함',
	'db.messages.exec.error-column-index-out-of-range': '열 인덱스  "__column__" 는 범위를 벗어남; 인덱스는 1에서 시작',
	'db.messages.exec.error-could-not-change-rel-alias-ambiguity': '모호성 때문에 릴레이션 가명 "__alias__"을 사용할 수 없음 ',
	'db.messages.exec.error-could-not-rename-ambiguity': '스키마 __schema__ 에서의 모호성 때문에 "__oldName__"을 위한 새로운 이름 "__newName__" 을 설정 할 수 없음',
	'db.messages.exec.error-schema-a-not-part-of-schema-b': '스키마  __schemaA__ 는 __schemaB__ 의 부분이 아님',
	'db.messages.exec.error-schemas-not-unifiable': '스키마들은 통합될 수 없음: 타입들은 다르거나 사이즈들이 다르다: __schemaA__  와 __schemaB__',
	'db.messages.exec.error-column-not-in-both-schemas': '열 "__column__"은 두 스키마의 조인에서 찾을 수 없음',
	'db.messages.exec.error-condition-must-be-boolean': '조건은 불린 대수여야만 함',
	'db.messages.exec.error-func-not-defined-for-column-type': '__func_ _은 타입 __colType__ 을 위해 정의될 수 없음',
	'db.messages.exec.error-join-would-produce-non-unique-columns': '조인은 고유하지 않은 열 이름에서 결과를 냄; 이 열들은 두 릴레이션 사이에서 나타남: __conflicts__',
	'db.messages.exec.error-no-columns-match-alias-star': '"__alias__.*"와 일치하는 열이 없음',
	'db.messages.exec.error-datatype-not-specified-for-col': '열 __index__의 데이터 타입 ("__column__")이 구체화되지 않음',
	'db.messages.exec.error-invalid-projection-error': '유효하지 않은 프로젝션 "__argument__": __error__',
	'db.messages.exec.error-function-expects-type': '함수 "__func__"는 인자 타입  "__expected__" 으로 기대하지만  "__given__" 이 주어짐',
	'db.messages.exec.error-could-not-compare-different-types': '타입이 다르면 비교할 수 없음: __typeA__ != __typeB__',
	'db.messages.exec.error-function-expects-arguments-of-same-type': '__func__ 는 모든 인자가 같은 타입으로 기대함',
	'db.messages.exec.error-case-when-condition-must-be-boolean': 'CASE WHEN 조건은 불린 타입이어야 함',
	'db.messages.exec.error-case-when-expects-results-of-same-type': '<i>CASE WHEN condition THEN result END</i>는 모든 <i>결과<i/>가 같은 타입으로 기대함',
	'db.messages.exec.error-invalid-date-format': '"__str__"  는 유효하지 않은 날짜; 형식: YYYY-MM-DD',
	'db.messages.translate.error-relation-not-found': '릴레이션  "{{name}}"을 찾을 수 없음',
	'db.messages.translate.warning-distinct-missing': 'DISTINCT 없음; 관계 대수는 암시적인 중복 제거를 사용함',
	'db.messages.translate.warning-ignored-all-on-set-operators': '집합 연산에서 무시된 ALL; 관계 대수는 암시적인 중복 제거를 사용함',
	'db.messages.translate.error-variable-name-conflict': '이름 충돌: 릴레이션 이름 "{{name}}" 은 이미 존재함',
	'db.messages.translate.error-variable-cyclic-usage': '변수  "{{name}}"의 순환 사용이 감지됨',
	'editor.codemirror-placeholder': ['쿼리는 이곳에 표시된다 ...', '', '키보드 단축키:', '\tstatement 실행:    [CTRL]+[RETURN]', '\tselection 실행:    [CTRL]+[SHIFT]+[RETURN]', '\t자동 완성:         [CTRL]+[SPACE]'].join('\n'),
	'editor.alert-message-headers.success': '성공',
	'editor.alert-message-headers.info': '정보',
	'editor.alert-message-headers.warning': '경고',
	'editor.alert-message-headers.error': ' 에러 ',
	'editor.inline-relation-editor.button-ok': 'ok',
	'editor.inline-relation-editor.button-cancel': '취소',
	'editor.inline-relation-editor.placeholder-column-name-and-types': '열 이름:타입',
	'editor.inline-relation-editor.enter-your-data': '데이터를 입력하라',
	'editor.inline-relation-editor.error-column-name-missing': '열 이름이 열 __index__에 없다',
	'editor.inline-relation-editor.error-wrong-quoted-string': '문자열은 작은따음표와 큰따음표를 포함할 수 없다.',
	'editor.error-no-query-found': '쿼리를 찾을 수 없다',
	'editor.pegjs-error.or': '또는',
	'editor.pegjs-error.no-input-found': '입력을 찾을 수 없음',
	'editor.pegjs-error.end-of-input': '입력의 끝',
	'editor.pegjs-error.expected-found': '예상 된 __expected__이지만 __found__이 발견됨.',
	'editor.error-at-line-x': '__line__ 줄에서',
	'calc.messages.error-query-missing': '쿼리를 찾을 수 없음',
	'calc.messages.error-query-missing-assignments-found': '쿼리를 찾을 수 없음 <a href="help.htm#relalg-assignment" target="_blank">Help - Assignments</a>',
	'calc.messages.gist-load-success': 'gist 불러오기 완료',
	'calc.menu.headline': '데이터셋 불러오기',
	'calc.menu.datasets': '데이터셋 불러오기',
	'calc.menu.load-gist-headline': 'gist에 저장된 데이터셋 불러오기',
	'calc.menu.load-gist-button': '불러오기',
	'calc.menu.load-gist-insert-placeholder': 'gist 아이디',
	'calc.menu.create-own-dataset-headline': '데이터셋 생성하기',
	'calc.menu.create-own-dataset-text[0]': '데이터셋을 만들고 다른 사람과 공유할 수 있습니다. ',
	'calc.menu.create-own-dataset-text[1]': '이에 대해 더 알고 싶으면',
	'calc.menu.create-own-dataset-button-new': '새로운 데이터셋 생성',
	'calc.menu.create-own-dataset-button-modify': '현재 데이터셋 수정',
	'calc.navigation.take-a-tour': '둘러보기',
	'calc.navigation.feedback': '피드백',
	'calc.navigation.help': '도움말',
	'calc.navigation.language': '언어',
	'calc.navigation.language-warning-reload-required': '새로고침!',
	'calc.maintainer-groups.misc': '다른 종류',
	'calc.maintainer-groups.temp': '임시',
	'calc.maintainer-groups.uibk': 'Innsbruck 대학교',
	'calc.maintainer-groups.ufes': '에스피리토 산토 연방대학교',
	'calc.editors.button-history': '기록',
	'calc.editors.insert-relation-title': 'Insert',
	'calc.editors.insert-relation-tooltip': 'Insert relation or column names',
	'calc.editors.group.tab-name': '그룹 에디터',
	'calc.editors.group.tab-name-short': '그룹 에디터',
	'calc.editors.group.toolbar.import-sql': 'SQL-덤프 가져오기',
	'calc.editors.group.toolbar.import-sql-content': 'SQL-컨텐트 가져오기',
	'calc.editors.group.toolbar.add-new-relation': '새로운 릴레이션 추가',
	'calc.editors.group.toolbar.add-new-relation-content': '릴레이션 에디터 열기',
	'calc.editors.group.button-download': '다운로드',
	'calc.editors.group.button-preview': '미리보기',
	'calc.editors.group.button-use': '에디터에서 그룹 사용하기',
	'calc.editors.group.button-use_plural': '에디터에서 여러 그룹 사용하기',
	'calc.editors.group.sql-import-group-name-placeholder': '그룹 이름(SQL로부터 불러옴)',
	'calc.editors.group.new-group-example-group': '-- 예시입니다\n\n그룹: nameOfTheNewGroup \n\n\nA = {\n\ta:string, b:number\n\texample,  42\n}',
	'calc.editors.group.modal-sqldump.modal-title': 'SQL-Dump 가져오기',
	'calc.editors.group.modal-sqldump.button-close': '닫기',
	'calc.editors.group.modal-sqldump.button-cancel': '취소',
	'calc.editors.group.modal-sqldump.button-import-sql': 'SQL 가져오기',
	'calc.editors.group.modal-sqldump.description': '그룹을 생성하려면 SQL-Dump 이곳에 가져와라',
	'calc.editors.ra.tab-name': '관계 대수',
	'calc.editors.ra.tab-name-short': '관계 대수',
	'calc.editors.ra.button-execute-query': '쿼리 실행',
	'calc.editors.ra.button-execute-selection': '셀렉션 실행',
	'calc.editors.ra.button-download': '다운로드',
    'calc.editors.ra.button-download-csv': '결과 (CSV)',
	'calc.editors.ra.button-download-jpg': '결과 (JPG)',
    'calc.editors.ra.button-download-query': '쿼리',
	'calc.editors.ra.toolbar.projection': '프로젝션',
	'calc.editors.ra.toolbar.projection-content[0]': '<b class="math">&pi;</b> a, b <b>(</b> A <b>)</b>',
	'calc.editors.ra.toolbar.projection-content[1]': '<br><b>pi</b> a, b A',
	'calc.editors.ra.toolbar.selection': '셀렉션',
	'calc.editors.ra.toolbar.selection-content[0]': '<b class="math">&sigma;</b> a < b ∧ b <span class="math">≠<span> c <b>(</b> A <b>)</b>',
	'calc.editors.ra.toolbar.selection-content[1]': '<br><b>sigma</b> a < b and b != c A',
	'calc.editors.ra.toolbar.rename': '릴레이션 이름 변경 / 열 이름 변경',
	'calc.editors.ra.toolbar.rename-content[0]': '<div><span class="math">&sigma;</span> x.a > 1 ( <b class="math">&rho;</b> x <b>(</b> A <b>)</b> )</div>',
	'calc.editors.ra.toolbar.rename-content[1]': '<div class="math">&sigma; A.y > 2 ( <b class="math">rho</b> y<b class="math">←</b>a <b>(</b> A <b>)</b> )</div>',
	'calc.editors.ra.toolbar.rename-columns-operator': '열 연산자 변경',
	'calc.editors.ra.toolbar.rename-columns-operator-content': '<div class="math">&sigma; A.y > 2 ( <b>&rho;</b> y<b class="math">←</b>a <b>(</b> A <b>)</b> )</div>',
	'calc.editors.ra.toolbar.orderBy': '정렬',
	'calc.editors.ra.toolbar.orderBy-content': '<div><b class="math">&tau;</b> a asc, [2] desc <b> (</b> A <b>)</b><div><div><b class="math">tau</b> a asc, [2] desc <b> (</b> A <b>)</b></div>',
	'calc.editors.ra.toolbar.groupBy': '그룹화',
	'calc.editors.ra.toolbar.groupBy-content[0]': '<div><b class="math">&gamma;</b> a, b<b>;</b> count(c)→c ( A )</div>',
	'calc.editors.ra.toolbar.groupBy-content[1]': '<div><b class="math">gamma</b> count(a)->x, sum(b)->y ( A )</div>',
	'calc.editors.ra.toolbar.and': '논리곱',
	'calc.editors.ra.toolbar.and-content': '<div><span class="math">&sigma;</span> a < b <b class="math">∧</b> b <span class="math">≠</span> c ( A )</div>',
	'calc.editors.ra.toolbar.xor': '배타적 논리',
	'calc.editors.ra.toolbar.xor-content': '<div><span class="math">&sigma;</span> a < b <b class="math">⊕</b> b <span class="math">≠</span> c ( A )</div>',
	'calc.editors.ra.toolbar.or': '논리합',
	'calc.editors.ra.toolbar.or-content': '<div><span class="math">&sigma;</span> a < b <b class="math">∨</b> b <span class="math">≠</span> c ( A )</div>',
	'calc.editors.ra.toolbar.not': '논리적 부정',
	'calc.editors.ra.toolbar.not-content': '<div>&sigma; <b>¬</b>(a < b) ( A )</div>',
	'calc.editors.ra.toolbar.equals': '등호',
	'calc.editors.ra.toolbar.equals-content': '<div>&sigma; a <b>=</b> b ( A )</div>',
	'calc.editors.ra.toolbar.not-equals': '부등호',
	'calc.editors.ra.toolbar.not-equals-content': "<div>&sigma; a <b>≠</b> 'text' ( A )</div>",
	'calc.editors.ra.toolbar.greater-or-equals': '크거나 같다',
	'calc.editors.ra.toolbar.greater-or-equals-content': '<div>&sigma; a <b>≥</b> 42 ( A )</div>',
	'calc.editors.ra.toolbar.lesser-or-equals': '작거나 같다',
	'calc.editors.ra.toolbar.lesser-or-equals-content': '<div>&sigma; a <b>≤</b> 42 ( A )</div>',
	'calc.editors.ra.toolbar.intersect': '교집합',
	'calc.editors.ra.toolbar.intersect-content': '<div><b>(</b> A <b>) <span class="math">&cap;</span> (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.union': '합집합',
	'calc.editors.ra.toolbar.union-content': '<div><b>(</b> A <b>) <span class="math">&cup;</span> (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.division': '디비전',
	'calc.editors.ra.toolbar.division-content': '<div><b>(</b> A <b>) ÷ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.subtraction': '차집합',
	'calc.editors.ra.toolbar.subtraction-content[0]': '<div><b>(</b> A <b>) - (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.subtraction-content[1]': '<div><b>(</b> A <b>) \\ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.cross-join': '카디션 프로덕트',
	'calc.editors.ra.toolbar.cross-join-content': '<div><b>(</b> A <b>) <b class="math">⨯</b> (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.natural-join': '자연 조인 / θ-조인',
	'calc.editors.ra.toolbar.natural-join-content[0]': '<div><b>(</b> A <b>) <b class="math">⋈</b> (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.natural-join-content[1]': '<div><b>(</b> A <b class="math">) ⋈ A.a ≥ B.a (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.left-outer-join': '왼쪽 외부 조인',
	'calc.editors.ra.toolbar.left-outer-join-content[0]': '<div><b>(</b> A <b class="math">) ⟕ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.left-outer-join-content[1]': '<div><b>(</b> A <b class="math">) ⟕ A.a < B.a (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.right-outer-join': '오른쪽 외부 조인',
	'calc.editors.ra.toolbar.right-outer-join-content[0]': '<div><b>(</b> A <b class="math">) ⟖ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.right-outer-join-content[1]': '<div><b>(</b> A <b class="math">) ⟖ A.a < B.a (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.full-outer-join': '완전 외부 조인',
	'calc.editors.ra.toolbar.full-outer-join-content[0]': '<div><b>(</b> A <b class="math">) ⟗ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.full-outer-join-content[1]': '<div><b>(</b> A <b class="math">) ⟗ A.a != B.a (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.left-semi-join': '왼쪽 세미 조인',
	'calc.editors.ra.toolbar.left-semi-join-content': '<div><b>(</b> A <b class="math">) ⋉ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.right-semi-join': '오른쪽 세미 조인',
	'calc.editors.ra.toolbar.right-semi-join-content': '<div><b>(</b> A <b class="math">) ⋊ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.anti-join': '안티 조인',
	'calc.editors.ra.toolbar.anti-join-content': '<div><b>(</b> A <b class="math">) ▷ (</b> B <b>)</b></div>',
	'calc.editors.ra.toolbar.assignment': '할당',
	'calc.editors.ra.toolbar.assignment-content[0]': '<div><b>X = </b> pi a ( A )',
	'calc.editors.ra.toolbar.assignment-content[1]': '<br /><b>Y = </b> pi b ( b )',
	'calc.editors.ra.toolbar.assignment-content[2]': '<br />( X ) <span class="math">&cup;</span> ( Y )<br /></div>',
	'calc.editors.ra.toolbar.single-line-comment': '한 줄 주석',
	'calc.editors.ra.toolbar.single-line-comment-content': '<span class="math">&pi;</span> a, b A <b>-- useful comment</b>',
	'calc.editors.ra.toolbar.multi-line-comment': '여러 줄 주석',
	'calc.editors.ra.toolbar.multi-line-comment-content': '<b>/* this is a very,<br>very long comment */</b><br><span class="math">&pi;</span> a, b A',
	'calc.editors.ra.toolbar.inline-relation': '인라인-릴레이션',
	'calc.editors.ra.toolbar.inline-relation-content': "&sigma; a = 'test' (<b>{<br>a:string, b:number, X.c:date<br>a, 1, 1970-01-01<br>}</b>)",
	'calc.editors.ra.toolbar.inline-relation-editor': '인라인-릴레이션 (에디터)',
	'calc.editors.ra.toolbar.inline-relation-editor-content': 'create a new inline-relation using a built in editor',
	'calc.editors.ra.toolbar.insert-date': '날짜 삽입',
	'calc.editors.ra.toolbar.insert-date-content[0]': "<span class=\"math\">&sigma;</span> a &lt; <b>date('1970-01-01')</b> ( A )",
	'calc.editors.sql.tab-name': 'SQL',
	'calc.editors.sql.tab-name-short': 'SQL',
	'calc.editors.sql.button-execute-query': '쿼리 실행',
	'calc.editors.sql.button-execute-selection': '셀렉션 실행',
	'calc.editors.sql.button-download': '다운로드',
	'calc.editors.sql.toolbar.select': 'select  문',
	'calc.editors.sql.toolbar.select-content': '<p>SELECT * FROM A</p><div>SELECT a, A.b, A.c FROM A</div>',
	'calc.editors.sql.toolbar.from': 'from 문',
	'calc.editors.sql.toolbar.from-content': '<div>SELECT * <br>FROM A, B as b<br>INNER JOIN C NATURAL</div>',
	'calc.editors.sql.toolbar.where': 'where 문',
	'calc.editors.sql.toolbar.where-content': 'SELECT * FROM A, B <br>where A.a = B.a or false',
	'calc.editors.sql.toolbar.group-by': 'group by 문',
	'calc.editors.sql.toolbar.group-by-content': 'SELECT a, COUNT(b) as num <br>FROM A <br>GROUP BY a',
	'calc.editors.sql.toolbar.having': 'having 문',
	'calc.editors.sql.toolbar.having-content': 'SELECT a, SUM(b) as sum <br>FROM A <br>GROUP BY a<br>having sum > 10',
	'calc.editors.sql.toolbar.order-by': 'order by 문',
	'calc.editors.sql.toolbar.order-by-content': '<p>SELECT * FROM A ORDER BY a asc, b desc</p><div>SELECT * FROM A ORDER BY 1, 2, 3</div>',
	'calc.editors.sql.toolbar.limit': 'limit 문',
	'calc.editors.sql.toolbar.limit-content': 'SELECT * FROM A <br>LIMIT 10 OFFSET 0',
	'calc.editors.sql.toolbar.insert-date': 'insert date',
	'calc.editors.sql.toolbar.insert-date-content[0]': 'select * from A',
	'calc.editors.sql.toolbar.insert-date-content[1]': "where a &lt; <b>date('1970-01-01')</b>",
	'calc.tour.welcome': '관계 대수 계산기, RelaX에 오신 걸 환영합니다',
	'calc.tour.choose-dataset-here': '여기서 데이터셋을 고를 수 있습니다',
	'calc.tour.currently-loaded-datasets': '현재 적재된 데이터셋입니다',
	'calc.tour.load-dataset-via-gist': '<p><a href="https://gist.github.com/" target="_blank">GitHub Gist</a>을 통해 공유된 데이터셋을 적재할 수 있습니</p>',
	'calc.tour.relation-attributes': '각 릴레이션의 속성과 그 데이터형을 클릭하여 에디터에 추가합니다',
	'calc.tour.ra-toolbar': '연산자들을 여기서 삽입할 수 있습니다<br>또는 <a href="help.htm#tutorial-user-plain-text-notation" target="_blank">alternative syntax</a>을 사용할 수 있습니다',
	'calc.tour.ra-statement-goes-here': '관계형 대수 문 이곳에...',
	'calc.tour.ra-example-query': '프로젝션, 셀렉션, 자연 조인을 사용하는 간단한 예시입니다',
	'calc.tour.ra-example-query-plaintext': '<a href="help.htm#tutorial-user-plain-text-notation" target="_blank">alternative plaintext syntax</a>을 사용한 같은 예제입니다',
	'calc.tour.ra-example-execute-it': '결과 보기',
	'calc.tour.ra-example-result': '현재 표현식과 실제 결과입니다',
	'calc.tour.ra-example-operator-tree': '<p>관계 대수 문의 연산 트리이다</p><p>모든 노드를 클릭하여 각 결과를 얻을 수 있습니다</p>',
	'calc.tour.switch-to-sql': '<p>SQL 에디터로 변환할 수 있습니다</p>',
	'calc.tour.sql-example-query': '이전에 봤던 예제이며, SQL로 작성되었습니다',
	'calc.tour.sql-example-execute-it': '결과 보기',
	'calc.tour.sql-example-result': '<p>SQL 문은 관계 대수로 변환되고 연산 트리와 결과를 볼 수 있다</p>',
	'calc.tour.end[0]': '<p>',
	'calc.tour.end[1]': '<a href="help.htm" target="_blank">도움말</a>을 통해 더 많은 정보를 볼 수 있습니다:',
	'calc.tour.end[2]': '</p><ul>',
	'calc.tour.end[3]': '<li><a href="help.htm#tutorial-user" target="_blank">a short tutorial for users explaining the basics</a></li>',
	'calc.tour.end[4]': '<li><a href="help.htm#relalg-reference" target="_blank">a complete reference of the supported relalg operators and the used syntax</a></li>',
	'calc.tour.end[5]': '<li><a href="help.htm#relalg-reference" target="_blank">a complete reference of the supported SQL subset and the supported syntax</a></li>',
	'calc.tour.end[6]': '<li><a href="help.htm#tutorial-maintainer" target="_blank">a short tutorial about how to create a new dataset for others</a></li>',
	'calc.tour.end[7]': '</ul>',
	'calc.result.modal.title': '',
	'calc.result.modal.close': '',
	'calc.editors.ra.inline-editor.title': 'Relation Editor',
	'calc.editors.ra.inline-editor.button-download-csv': 'Download CSV',
	'calc.editors.ra.inline-editor.button-upload-csv': 'upload CSV',
	'calc.editors.ra.inline-editor.button-cancel': 'Cancel',
	'calc.editors.ra.inline-editor.row-name': 'Name',
	'calc.editors.ra.inline-editor.row-type': 'Type',
	'calc.editors.ra.inline-editor.button-ok': 'Ok',
	'calc.editors.ra.inline-editor.input-relation-name': 'Relation Name',
	'calc.result.exec.time': 'Execution time:',
	'local.change': '언어를 변경하려면 페이지를 새로고침하시겠습니까?',
};
