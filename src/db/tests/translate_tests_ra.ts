/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Relation } from 'db/exec/Relation';
import * as relalgjs from '../relalg';

QUnit.module('translate relational algebra ast to relational algebra');

// const relations = getTestRelations();

function exec_ra(query: string, relations: { [key: string]: Relation }) {

	return relalgjs.executeRelalg(query, relations);
}

function getTestRelations() {
	// create the three source tables
	const R = relalgjs.executeRelalg(`{
		R.a, R.b, R.c

		1,   a,   d
		3,   c,   c
		4,   d,   f
		5,   d,   b
		6,   e,   f
	}`, {});

	const S = relalgjs.executeRelalg(`{
		S.b, S.d

		a,   100
		b,   300
		c,   400
		d,   200
		e,   150
	}`, {});

	const T = relalgjs.executeRelalg(`{
		T.b, T.d

		a,   100
		d,   200
		f,   400
		g,   120
	}`, {});

	return {
		R: new Relation('R', R),
		S: new Relation('S', S),
		T: new Relation('T', T),
	};
}

QUnit.testStart(function () {
});


QUnit.test('test relation', function (assert) {
	const relations = getTestRelations();
	const query = 'R';
	const root = exec_ra(query, relations);
	root.check();

	assert.deepEqual(root.getResult(), relations.R.getResult());
});

QUnit.test('test dum relation 1', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra(`pi 1->a {}`, relations);

	const ref = exec_ra(`sigma a<1 {
		a

		10
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dum relation 2', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra(`gamma count(*)->n {}`, relations);

	const ref = exec_ra(`{
		n

		0
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dum relation 3', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra(`R x {}`, relations);

	const ref = exec_ra(`R - R`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dum relation 4', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra(`{} x R`, relations);

	const ref = exec_ra(`R - R`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dee relation 1', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra(`pi 1->a {()}`, relations);

	const ref = exec_ra(`{
		a

		1
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dee relation 2', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra(`gamma count(*)->n {()}`, relations);

	const ref = exec_ra(`{
		n

		1
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test dee relation 3', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra(`R x {()}`, relations);

	assert.deepEqual(root.getResult(), relations.R.getResult());
});

QUnit.test('test dee relation 4', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra(`{()} x R`, relations);

	assert.deepEqual(root.getResult(), relations.R.getResult());
});

QUnit.test('test inline-relation', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra(`{
		R.a:number, R.b:string, R.c:string
		1,          a,          d
		3,          'c',        'c'
		4,          d,          f
		5,          d,          b
		6,          'e',        'f'
	}`, relations);

	assert.deepEqual(root.getResult(), relations.R.getResult());
});

QUnit.test('test inline-relation 2', function (assert) {
	const root = exec_ra(`{
		a, b, c
		-1, a, null
		3.3, null, 2014-01-01
		-3.3, null, 2014-01-01
		'-3.3', null, null
	}`, getTestRelations());
	const result = root.getResult();

	const reference_rows = [
		[-1, 'a', null],
		[3.3, null, new Date(2014, 0, 1)],
		[-3.3, null, new Date(2014, 0, 1)],
		[-3.3, null, null],
	];

	// compare data
	assert.deepEqual(result.getRows(), reference_rows);

	// compare schema
	const schema = result.getSchema();
	assert.equal(schema.getType(0), 'number');
	assert.equal(schema.getType(1), 'string');
	assert.equal(schema.getType(2), 'date');

	assert.equal(schema.getFullName(0), 'a');
	assert.equal(schema.getFullName(1), 'b');
	assert.equal(schema.getFullName(2), 'c');
});


QUnit.test('test inline-relation 3: booleans', function (assert) {
	const root = exec_ra(`{
		a, b, c:string
		true, null, true
		false, false, false
	}`, getTestRelations());
	const result = root.getResult();

	const referenceRows = [
		[true, null, 'true'],
		[false, false, 'false'],
	];

	// compare data
	assert.deepEqual(result.getRows(), referenceRows);

	// compare schema
	const schema = result.getSchema();
	assert.equal(schema.getType(0), 'boolean');
	assert.equal(schema.getType(1), 'boolean');
	assert.equal(schema.getType(2), 'string');

	assert.equal(schema.getFullName(0), 'a');
	assert.equal(schema.getFullName(1), 'b');
	assert.equal(schema.getFullName(2), 'c');
});


QUnit.test('test not existant relation', function (assert) {
	try {
		const query = 'X';
		exec_ra(query, getTestRelations());

		assert.ok(false, 'table does not exist');
	}
	catch (e) {
		assert.ok(true, 'table not found');
	}
});

QUnit.test('test selection[true](R)', function (assert) {
	const relations = getTestRelations();
	const query = 'sigma true (R)';
	const root = exec_ra(query, relations);

	assert.deepEqual(root.getResult(), relations.R.getResult());
});

QUnit.test('test selection[a>=3](R)', function (assert) {
	const relations = getTestRelations();
	const query = 'sigma a >= 3 (R)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a, R.b, R.c

		3, 'c', 'c'
		4, 'd', 'f'
		5, 'd', 'b'
		6, 'e', 'f'
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection[not b=c](R)', function (assert) {
	const relations = getTestRelations();
	const query = 'sigma ! (b=c) R';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a, R.b, R.c

		1, 'a', 'd'
		4, 'd', 'f'
		5, 'd', 'b'
		6, 'e', 'f'
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection[a = true]({})', function (assert) {
	const relations = getTestRelations();
	const query = 'sigma a = true ({a, b\ntrue, 1\nfalse, 2})';
	const root = exec_ra(query, relations);

	const reference = exec_ra(`{
		a:boolean, b:number

		true, 1
	}`, relations);

	assert.deepEqual(root.getResult(), reference.getResult());
});

QUnit.test('test selection[a>3 and a>-1](R)', function (assert) {
	const relations = getTestRelations();
	const query = 'sigma a > 3 and a>-1 (R)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a, R.b, R.c

		4, 'd', 'f'
		5, 'd', 'b'
		6, 'e', 'f'
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection[a = 3 or b = \'e\'](R)', function (assert) {
	const relations = getTestRelations();
	const query = "sigma a = 3 or b = 'e' (R)";
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a, R.b, R.c

		3, 'c', 'c'
		6, 'e', 'f'
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with xor', function (assert) {
	const relations = getTestRelations();
	const query = "sigma b = \'d\' xor a = 4 (R)";
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a, R.b, R.c

		5, 'd', 'b'
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection[*](R)', function (assert) {
	const relations = getTestRelations();
	const query = 'pi * (R)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a, R.b, R.c

		1, 'a', 'd'
		3, 'c', 'c'
		4, 'd', 'f'
		5, 'd', 'b'
		6, 'e', 'f'
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection[a, b](R)', function (assert) {
	const relations = getTestRelations();
	const query = 'pi a, b (R)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a, R.b

		1, 'a'
		3, 'c'
		4, 'd'
		5, 'd'
		6, 'e'
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection[b, a](R)', function (assert) {
	const relations = getTestRelations();
	const query = 'pi b, a (R)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.b, R.a

		'a', 1
		'c', 3
		'd', 4
		'd', 5
		'e', 6
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection[b, a, a, b](R)', function (assert) {
	try {
		const query = 'pi b, a, a, b (R)';
		exec_ra(query, getTestRelations());
		assert.ok(false);
	}
	catch (e) {
		assert.ok(true);
	}
});

QUnit.test('test (pi * (R)) inner join [R.b = S.b] (pi * (S))', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra('(pi * R) inner join R.b = S.b (pi * S)', relations);
	const ref = exec_ra(`{
		R.a:number, R.b:string, R.c:string, S.b:string, S.d:number

		1,          'a',        'd',        'a',        100
		3,          'c',        'c',        'c',        400
		4,          'd',        'f',        'd',        200
		5,          'd',        'b',        'd',        200
		6,          'e',        'f',        'e',        150
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test (R) inner join [R.b = S.b] join (S)', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra('(R) inner join R.b = S.b (S)', relations);
	const ref = exec_ra(`{
		R.a:number, R.b:string, R.c:string, S.b:string, S.d:number

		1,          'a',        'd',        'a',        100
		3,          'c',        'c',        'c',        400
		4,          'd',        'f',        'd',        200
		5,          'd',        'b',        'd',        200
		6,          'e',        'f',        'e',        150
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});


QUnit.test('test rename relation', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra('pi t.a, b (rho t (R))', relations);

	const ref = exec_ra(`{
		t.a:number, t.b:string

		1, 'a'
		3, 'c'
		4, 'd'
		5, 'd'
		6, 'e'
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});


QUnit.test('test rename column', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra('rho x<-a (pi t.a, t.b (rho t (R)))', relations);

	const ref = exec_ra(`{
		t.x:number, t.b:string

		1, 'a'
		3, 'c'
		4, 'd'
		5, 'd'
		6, 'e'
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test rename column 2', function (assert) {
	const relations = getTestRelations();
	const query = 'rho b<-a, a<-b {a, b\n1, 2\n3, 4}';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		b:number, a:number

		1, 2
		3, 4
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test rename column (non existant)', function (assert) {
	try {
		const relations = getTestRelations();
		const query = 'rho fail->x {a, b\n1, 2\n3, 4}';
		exec_ra(query, relations);

		assert.ok(false);
	}
	catch (e) {
		assert.ok(true); // should fail
	}
});


QUnit.test('test union 0', function (assert) {
	const query = '(S) union (T)';
	const relations = getTestRelations();
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		S.b:string, S.d:number

		'a',        100
		'b',        300
		'c',        400
		'd',        200
		'e',        150
		'f',        400
		'g',        120
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test union 1', function (assert) {
	const relations = getTestRelations();
	const query = '((R) union (R)) union (R)';
	const root = exec_ra(query, relations);

	const ref = relations.R.getResult();

	const result = root.getResult();
	assert.deepEqual(result, ref);
});

QUnit.test('test intersect 0', function (assert) {
	const relations = getTestRelations();
	const query = '(S) intersect (T)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		S.b:string, S.d:number

		'a',        100
		'd',        200
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test intersect 1', function (assert) {
	const relations = getTestRelations();
	const query = '(S) intersect (S)';
	const root = exec_ra(query, relations);

	const ref = relations.S.getResult();

	const result = root.getResult();
	assert.deepEqual(result, ref);
});

QUnit.test('test division 0', function (assert) {
	const srcTableB = exec_ra(`{
		B.b:string

		b1
		b2
		b3
	}`, {});
	const srcTableA = exec_ra(`{
		B.a:string, B.b:string

		'a1', 'b1'
		'a1', 'b2'
		'a1', 'b3'
		'a1', 'b4'

		'a2', 'b1'
		'a2', 'b3'

		'a3', 'b2'
		'a3', 'b3'
		'a3', 'b4'

		'a4', 'b1'
		'a4', 'b2'
		'a4', 'b3'
	}`, {});

	const query = '(A) ÷ (B)';
	const root = exec_ra(query, {
		A: new Relation('A', srcTableA),
		B: new Relation('B', srcTableB),
	});

	const ref = exec_ra(`{
		B.a

		a1
		a4
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test difference 0', function (assert) {
	const relations = getTestRelations();
	const query = '(S) - (T)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		S.b, S.d

		b, 300
		c, 400
		e, 150
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test difference 1', function (assert) {
	const relations = getTestRelations();
	const query = '(T) - (S)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		T.b, T.d

		f,   400
		g,   120
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test difference 2', function (assert) {
	const relations = getTestRelations();
	const query = '(T) - (T)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		T.b:string, T.d:number
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test difference 3', function (assert) {
	const srcTableA = exec_ra(`{
		A.b, A.d

		2,   2
		1,   2
		3,   3
	}`, {});

	const srcTableB = exec_ra(`{
		B.b, B.d

		2,   4
	}`, {});

	const query = '(A) - (B)';
	const root = exec_ra(query, {
		A: new Relation('A', srcTableA),
		B: new Relation('B', srcTableB),
	});

	const ref = exec_ra(`{
		A.b, A.d

		2,   2
		1,   2
		3,   3
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test renameColumns 0', function (assert) {
	const relations = getTestRelations();
	const query = 'sigma false (rho x<-b, y<-d (S))';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		S.x:string, S.y:number
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test renameRelation 0', function (assert) {
	const relations = getTestRelations();
	const query = 'sigma t.d = 100 (rho t (S))';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		t.b:string, t.d:number
		a, 100
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test renameRelation 1', function (assert) {
	const relations = getTestRelations();
	const query = 'sigma d = 100 (rho t (S))';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		t.b:string, t.d:number
		a, 100
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test thetaJoin 0', function (assert) {
	const relations = getTestRelations();
	const root = exec_ra('(S) join S.d = T.d (T)', relations);
	const ref = exec_ra(`{
		S.b, S.d, T.b, T.d

        'a', 100, 'a', 100
		'c', 400, 'f', 400
		'd', 200, 'd', 200
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test thetaJoin 1', function (assert) {
	const relations = getTestRelations();
	const query = '(S) join S.d = T.d and T.b != S.b (T)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		S.b, S.d, T.b, T.d

		'c', 400, 'f', 400
	}`, relations);
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test crossJoin 0', function (assert) {
	const relations = getTestRelations();
	const query = "(sigma b<='b' (S)) cross join (sigma b<='d' (T))";
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		S.b:string, S.d:number, T.b:string, T.d:number

		'a',        100,        'a',        100
		'a',        100,        'd',        200
		'b',        300,        'a',        100
		'b',        300,        'd',        200
	}`, relations);

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test crossJoin 1', function (assert) {
	const relations = getTestRelations();
	const query = '(S) cross join (T)';
	const root = exec_ra(query, relations);

	const query2 = '(S) join true (T)';
	const root2 = exec_ra(query2, relations);

	assert.deepEqual(root.getResult(), root2.getResult());
});

QUnit.test('test naturalJoin 0', function (assert) {
	const relations = getTestRelations();
	const query = '(S) natural join (T)';
	const root = exec_ra(query, relations);

	const query2 = 'pi S.b, S.d ((S) join S.b=T.b and S.d=T.d (T))';
	const root2 = exec_ra(query2, relations);

	assert.deepEqual(root.getResult(), root2.getResult());
});

QUnit.test('test naturalJoin 1', function (assert) {
	const relations = getTestRelations();
	const query = '(R) natural join (S)';
	const root = exec_ra(query, relations);

	const query2 = 'pi a, R.b, c, d ((R) join R.b=S.b (S))';
	const root2 = exec_ra(query2, relations);

	assert.deepEqual(root.getResult(), root2.getResult());
});

QUnit.test('test leftSemiJoin 0', function (assert) {
	const relations = getTestRelations();
	const query = '((R) left semi join (T))';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		R.a:number, R.b:string, R.c:string

		1, 'a', 'd'
		4, 'd', 'f'
		5, 'd', 'b'
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test rightSemiJoin 0', function (assert) {
	const relations = getTestRelations();
	const query = '((R) right semi join (T))';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		T.b:string, T.d:number

		a, 100
		d, 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test leftOuterJoin 0', function (assert) {
	const relations = getTestRelations();
	const query = '(T) left outer join T.b=S.b (S)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		T.b, T.d, S.b, S.d

		'a', 100, 'a',  100
		'd', 200, 'd',  200
		'f', 400, null, null
		'g', 120, null, null
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test rightOuterJoin 0', function (assert) {
	const relations = getTestRelations();
	const query = '(T) right outer join T.b=S.b (S)';
	const root = exec_ra(query, relations);

	const ref = exec_ra(`{
		T.b, T.d, S.b, S.d

		'a',  100,  'a', 100
		null, null, 'b', 300
		null, null, 'c', 400
		'd',  200,  'd', 200
		null, null, 'e', 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test fullOuterJoin 0', function (assert) {
	const query = '(T) full outer join T.b=S.b (S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		T.b, T.d, S.b, S.d

		'a',  100,  'a',  100
		'd',  200,  'd',  200
		'f',  400,  null, null
		'g',  120,  null, null
		null, null, 'b',  300
		null, null, 'c',  400
		null, null, 'e',  150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test fullOuterJoin (natural)', function (assert) {
	const query = '(T) full outer join (S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		T.b, T.d, S.b, S.d

		'a',  100,  'a',  100
		'd',  200,  'd',  200
		'f',  400,  null, null
		'g',  120,  null, null
		null, null, 'b',  300
		null, null, 'c',  400
		null, null, 'e',  150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test is null 0', function (assert) {
	const query = 'sigma S.b = null ((T) left outer join T.b=S.b (S))';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		T.b:string, T.d:number, S.b:string, S.d:number

		'f',  400,  null, null
		'g',  120,  null, null
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test is not null 1', function (assert) {
	const query = 'sigma S.b != null ((T) left outer join T.b=S.b (S))';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		T.b:string, T.d:number, S.b:string, S.d:number

		'a',  100,  'a',  100
		'd',  200,  'd',  200
	}`, {});
	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy 0', function (assert) {
	const query = 'tau [1] (sigma a >= 3 (R))';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c

		3,   c,   c
		4,   d,   f
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test natural join with columns of same name 0', function (assert) {
	const relations = getTestRelations();
	const query = 'R natural join (pi b S natural join pi b T)';
	const root = exec_ra(query, relations);

	const schema = root.getResult().getSchema();

	assert.deepEqual(schema, relations.R.getSchema());
});

QUnit.test('test natural join with columns of same name 1', function (assert) {
	const relations = getTestRelations();
	const query = '(R natural join pi b S) natural join pi b T';
	const root = exec_ra(query, relations);

	const schema = root.getResult().getSchema();

	assert.deepEqual(schema, relations.R.getSchema());
});

QUnit.test('groupby 0', function (assert) {
	const result = exec_ra('gamma a; sum(b)->c ({a, b\n' +
		'a, 1\n' +
		'a, 2\n' +
		'b, 1\n' +
		'})', {}).getResult();

	const reference = exec_ra('{a, c\n' +
		'a, 3\n' +
		'b, 1\n' +
		'}', {}).getResult();

	const equals = result.equals(reference);
	assert.ok(equals);
});

QUnit.test('groupby 1', function (assert) {
	const result = exec_ra('gamma a; count(*)->c ({a, b\n' +
		'a, 1\n' +
		'a, 2\n' +
		'b, 1\n' +
		'})', {}).getResult();

	const reference = exec_ra('{a, c\n' +
		'a, 2\n' +
		'b, 1\n' +
		'}', {}).getResult();

	const equals = result.equals(reference);
	assert.ok(equals);
});

QUnit.test('groupby 2 - no groups', function (assert) {
	const result = exec_ra('gamma count(*)->c, sum(b)->d ({a, b\n' +
		'a, 1\n' +
		'a, 2\n' +
		'b, 1\n' +
		'})', {}).getResult();

	const reference = exec_ra('{c, d\n' +
		'3, 4\n' +
		'}', {}).getResult();

	const equals = result.equals(reference);
	assert.ok(equals);
});

QUnit.test('test space between plaintext and and operands', function (assert) {
	const relations = getTestRelations();
	try {
		exec_ra('sigma trueandfalse R', relations);

		assert.ok(false, 'should not be accepted; no space between and');
	}
	catch (e) {
		exec_ra('sigma true and false R', relations);
		assert.ok(true, 'ok');
	}
});

QUnit.test('antijoin 1', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra('S anti join T', relations).getResult();

	const reference = exec_ra('{S.b, S.d\n' +
		'b, 300\n' +
		'c, 400\n' +
		'e, 150\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('rownum 1', function (assert) {
	const result = exec_ra('pi a, b, ROWNUM()->ROWNUM ({a, b\n' +
		'a, 1\n' +
		'a, 2\n' +
		'b, 1\n' +
		'})', getTestRelations()).getResult();

	const reference = exec_ra('{a, b, ROWNUM\n' +
		'a, 1, 1\n' +
		'a, 2, 2\n' +
		'b, 1, 3\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('rownum 2', function (assert) {
	exec_ra('pi a, ROWNUM ({a, ROWNUM\n' +
		'a, 1\n' +
		'a, 2\n' +
		'b, 1\n' +
		'})', {}).getResult();

	// rownum is a function now => name ROWNUM is a normal column name => allowed in schema
	assert.ok(true);
});

QUnit.test('natural left outer join 1', function (assert) {
	const result = exec_ra('{R.a, R.b\n' +
		'1, a\n' +
		'2, a\n' +
		'3, d\n}' +
		' left outer join ' +
		'{S.b, S.c\n' +
		'a, 5\n' +
		'b, 6}', {}).getResult();

	const reference = exec_ra('{R.a, R.b, S.c\n' +
		'1, a, 5\n' +
		'2, a, 5\n' +
		'3, d, null\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('natural left outer join 2', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra('R left outer join R', relations).getResult();

	const reference = exec_ra('R', relations).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('natural right outer join 1', function (assert) {
	const result = exec_ra('{R.a, R.b\n' +
		'1, a\n' +
		'2, a\n' +
		'}' +
		' right outer join ' +
		'{S.a, S.c\n' +
		'1, a\n' +
		'2, b\n' +
		'3, b\n' +
		'}',
		{},
	).getResult();

	const reference = exec_ra('{R.b, S.a, S.c\n' +
		'a, 1, a\n' +
		'a, 2, b\n' +
		'null, 3, b\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('natural right outer join 2', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra('R right outer join R', relations).getResult();

	const reference = exec_ra('R', relations).getResult();

	assert.deepEqual(result, reference);
});


QUnit.test('ra to text 1', function (assert) {
	const ast = relalgjs.parseRelalg('R', []);
	relalgjs.replaceVariables(ast, {});
	const text = relalgjs.textFromRelalgAstRoot(ast);
	assert.equal(text, 'R');
});

QUnit.test('ra to text 2', function (assert) {
	const ast = relalgjs.parseRelalg(`{
		a, b, c
		a, 1, 2001-01-01
		null, null, null
	}`, []);
	relalgjs.replaceVariables(ast, {});
	const text = relalgjs.textFromRelalgAstRoot(ast);

	assert.equal(text, "{\n\ta:string, b:number, c:date    \n	'a'     , 1       , 2001-01-01\n	null    , null    , null      \n}");
});

QUnit.test('ra to text 3', function (assert) {
	const relations = getTestRelations();
	const query = 'pi [1], [2], [3] (rho a R x rho b R)';
	const ast = relalgjs.parseRelalg(query);
	relalgjs.replaceVariables(ast, {});
	const text = relalgjs.textFromRelalgAstRoot(ast);
	const result = exec_ra(text, relations).getResult();

	const reference = exec_ra(query, relations).getResult();
	assert.deepEqual(result, reference);
});


QUnit.module('relational algebra with eval');


QUnit.test('pi with eval aritmetic', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra(`
		pi a, a->b, a-a->a0, a1<-a+a, 2*a->a2, a/2->a3, a%2->a4 (
		 {a\n1\n2}
		)`, relations).getResult();

	const reference = exec_ra('{a b a0 a1 a2 a3 a4 \n' +
		'1 1 0 2 2 0.5 1\n' +
		'2 2 0 4 4 1   0\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('pi with eval: constants', function (assert) {
	const result = exec_ra(" pi a, 'test'->b, 1->c, date('1970-01-01')->d, true->e, false->f {a\n1\n2} ", {}).getResult();

	const reference = exec_ra('{a, b, c, d, e, f\n' +
		'1, test, 1, 1970-01-01, true, false\n' +
		'2, test, 1, 1970-01-01, true, false\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('pi with eval: date', function (assert) {
	const result = exec_ra('pi a, adddate(a, 1)->b, year(a)->c, month(a)->d, day(a)->e, adddate(subdate(a, 1), 1)=a->f {a\n1970-01-01\n1970-01-02} ', {}).getResult();

	const reference = exec_ra('{a, b, c, d, e, f\n' +
		'1970-01-01 1970-01-02, 1970 1 1 true\n' +
		'1970-01-02 1970-01-03, 1970 1 2 true\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('pi with wrong date format', function (assert) {
	try {
		const query = "pi date('01-01-1970')->d (R)";
		exec_ra(query, getTestRelations());
		assert.ok(false);
	}
	catch (e) {
		assert.ok(true);
	}
});

QUnit.test('pi with eval: upper()', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra(" sigma x < 'D' pi upper(S.b)->x S ", relations).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra(`
	{
		x:string
		A
		B
		C
	}`, {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('pi with eval: lower()', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra(" sigma y < 'd' (pi lower(x)->y (pi upper(S.b)->x S)) ", relations).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra(`
	{
		y:string
		a
		b
		c
	}`, {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('pi with eval: repeat()', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra(" pi repeat(b, 3)->x (R) ", relations).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{x:string\n' +
		'aaa\n' +
		'ccc\n' +
		'ddd\n' +
		'eee\n' +
	'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('pi with eval: replace()', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra(" pi replace(x, 'c', 'C')->y (pi concat(a, b, c)->x (R)) ", relations).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{y:string\n' +
		'1ad\n' +
		'3CC\n' +
		'4df\n' +
		'5db\n' +
		'6ef\n' +
	'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('pi with eval: reverse()', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra(" pi reverse(x)->y (pi concat(a, b, c)->x (R)) ", relations).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{y:string\n' +
		'da1\n' +
		'cc3\n' +
		'fd4\n' +
		'bd5\n' +
		'fe6\n' +
	'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('pi with eval: add()', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra(' pi a, add(a, a) ->x R ', relations).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{R.a, x\n' +
		'1, 2\n' +
		'3, 6\n' +
		'4, 8\n' +
		'5, 10\n' +
		'6, 12\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});


QUnit.test('coalesce - working - constant', function (assert) {
	const result = exec_ra('pi coalesce(null, 1)->x {a:number\n2}', {}).getResult();
	const reference = exec_ra('{x:number\n1}', {}).getResult();
	assert.deepEqual(result, reference);
});

QUnit.test('coalesce - working - column', function (assert) {
	const result = exec_ra('pi coalesce(null, a, 1)->x {a:number\nnull\n2}', {}).getResult();
	const reference = exec_ra('{x:number\n1\n2}', {}).getResult();
	assert.deepEqual(result, reference);
});

QUnit.test('coalesce - error all null', function (assert) {
	try {
		exec_ra('pi coalesce(null, null)->x {a:number\n2}', {}).getResult();
	}
	catch (e) {
		assert.ok(true);
	}
});

QUnit.test('case when - working', function (assert) {
	const result = exec_ra('pi (case when a = 1 then a*10 else a end)+1->x {a:number\n1\n2}', {}).getResult();
	const reference = exec_ra('{x:number\n11\n3}', {}).getResult();
	assert.deepEqual(result, reference);
});

QUnit.test('n-ary concat', function (assert) {
	const result = exec_ra("pi concat(b,'x',b,c)->x R ", getTestRelations()).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{x\n' +
		'axad\n' +
		'cxcc\n' +
		'dxdf\n' +
		'dxdb\n' +
		'exef\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('pipe-concat-operator', function (assert) {
	const result = exec_ra("pi b||'x'||b||c->x R ", getTestRelations()).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{x\n' +
		'axad\n' +
		'cxcc\n' +
		'dxdf\n' +
		'dxdb\n' +
		'exef\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('bug: keywords were detected as column names', function (assert) {
	// this statement would not work if "sigma" was interpreted as a column name
	const result = exec_ra('R join sigma b=b S', getTestRelations()).getResult();
	const reference = exec_ra('R natural join S', getTestRelations()).getResult();
	assert.deepEqual(result, reference);
});

QUnit.test('relation-name not interpreted as column name', function (assert) {
	const relations = getTestRelations();
	const result = exec_ra('S2 = T join R    S2', relations).getResult();
	// was failing because S2 was interpreted as relation and R as column

	const reference = exec_ra('S2 = T natural join R   S2', relations).getResult();
	assert.deepEqual(result, reference);
});

QUnit.test('relation-name not interpreted as column name 2', function (assert) {
	/* boolean-column with same name as Relation should be possible
	 by either () it or with full qualified name */
	const relations = getTestRelations();
	const result = exec_ra('S1 = pi (a>0)->R R \n' +
		'S2 = S join (R) S1 \n' +
		'sigma d=100 S2', relations).getResult();
	const reference = exec_ra('{S.b, S.d, R\n a, 100, true\n}', {}).getResult();
	assert.deepEqual(result, reference);
});

QUnit.test('test like operator', function (assert) {
	const result = exec_ra(`pi x, x like 'a%'->a, x like '%b'->b, x like '%a%'->c, x like 'a_a'->d {
	x

	abb
	bba
	bab
	aba
	}`, {}).getResult();

	const reference = exec_ra(`{
	x,   a,     b,     c,     d

	abb, true,  true,  true, false
	bba, false, false, true, false
	bab, false, true,  true, false
	aba, true,  false, true, true
	}`, {}).getResult();
	assert.deepEqual(result, reference);
});

QUnit.test('test regexp operator', function (assert) {
	const result = exec_ra(`pi x, x regexp '^(a|e)'->starts_a_or_e, x regexp '(a|e)$'->ends_a_or_e, x rlike '(a|e)'->has_a_or_e {
	x

	abb
	bba
	bab
	ebe
	}`, {}).getResult();

	const reference = exec_ra(`{
	x, starts_a_or_e, ends_a_or_e, has_a_or_e

	abb, true,  false, true
	bba, false, true,  true
	bab, false, false, true
	ebe, true,  true,  true
	}`, {}).getResult();
	assert.deepEqual(result, reference);
});

QUnit.test('groupby textgen', function (assert) {
	const ast = relalgjs.parseRelalg(`gamma a; sum(b)->c ({a, b
		a, 1
	})`);
	const text = relalgjs.textFromRelalgAstRoot(ast);

	assert.strictEqual(text, 'γ a ; c ← SUM(b) ( {\n' +
		'\ta:string, b:number\n' +
		"\t'a'     , 1       \n" +
		'} ) ');
});

QUnit.test('whitespace(s) between aggregate function and opening parenthesis', function (assert) {
	const result = exec_ra("gamma ; sum (a)->total_a (R)", getTestRelations()).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{total_a\n' +
		'19\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('whitespace(s) between count(*) function and opening parenthesis', function (assert) {
	const result = exec_ra("gamma ; count    (*)->n (R)", getTestRelations()).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{n\n' +
		'5\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('whitespace(s) between n-ary text function and opening parenthesis', function (assert) {
	const result = exec_ra("pi concat  (a, b, c)->k (R)", getTestRelations()).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{k\n' +
		'1ad\n' +
		'3cc\n' +
		'4df\n' +
		'5db\n' +
		'6ef\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('whitespace(s) between binary function and opening parenthesis', function (assert) {
	const result = exec_ra("pi add    (a, 5)->a_plus_5 (R)", getTestRelations()).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{a_plus_5\n' +
		'6\n' +
		'8\n' +
		'9\n' +
		'10\n' +
		'11\n' +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('whitespace(s) between unary function and opening parenthesis', function (assert) {
	const result = exec_ra("pi a + length  (  c )->x, upper (   b  )->k (R)", getTestRelations()).getResult();
	result.eliminateDuplicateRows();

	const reference = exec_ra('{\tx:number, k:string\n' +
		"\t2, 'A'\n" +
		"\t4, 'C'\n" +
		"\t5, 'D'\n" +
		"\t6, 'D'\n" +
		"\t7, 'E'\n" +
		'}', {}).getResult();

	assert.deepEqual(result, reference);
});

QUnit.test('test orderBy explicit column of relation', function (assert) {
	const query = 'tau R.a asc (R)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c
		1,   a,   d
		3,   c,   c
		4,   d,   f
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy implicit column of relation', function (assert) {
	const query = 'tau a asc (R)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c
		1,	 a,		d
		3,   c,   c
		4,   d,   f
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy implicit column of relation from local variable', function (assert) {
	const query = 'k = R tau a asc (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c
		1,	 a,		d
		3,   c,   c
		4,   d,   f
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit column of relation from local variable', function (assert) {
	const query = 'k = R tau R.a asc (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c
		1,	 a,		d
		3,   c,   c
		4,   d,   f
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit column of local variable', function (assert) {
	const query = 'k = R tau k.a asc (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c
		1,	 a,		d
		3,   c,   c
		4,   d,   f
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy implicit columns of relations from natural join', function (assert) {
	const query = 'tau a asc, b desc, d (R ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit columns of relations from natural join', function (assert) {
	const query = 'tau R.a asc, R.b desc, S.d (R ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy implicit columns of relations from natural join of local variable and relation', function (assert) {
	const query = 'k = R j = S tau a asc, b desc, d (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit columns of relations from natural join of local variable and relation', function (assert) {
	const query = 'k = R j = S tau R.a asc, R.b desc, S.d (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit columns of local variable from natural join of local variable and relation', function (assert) {
	const query = 'k = R j = S tau k.a asc, k.b desc, S.d (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy implicit columns of relations from join of relation and local variable', function (assert) {
	const query = 'k = R j = S tau a asc, b desc, d (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit columns of relations from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S tau R.a asc, R.b desc, S.d (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit columns of local variable from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S tau R.a asc, R.b desc, j.d (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy implicit columns of relations from natural join of local variables', function (assert) {
	const query = 'k = R j = S tau a asc, b desc, d (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit columns of relations from natural join of local variables', function (assert) {
	const query = 'k = R j = S tau R.a asc, R.b desc, S.d (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit columns of local variables from natural join of local variables', function (assert) {
	const query = 'k = R j = S tau k.a asc, k.b desc, j.d (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy implicit columns of relations from natural join of multiple relations', function (assert) {
	const query = 'tau a asc, b desc, d (R ⨝ S ⨝ T)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit columns of relations from natural join of multiple relations', function (assert) {
	const query = 'tau R.a asc, R.b desc, S.d (R ⨝ S ⨝ T)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy implicit columns from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T tau a asc, b desc, d (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit columns of relations from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T tau R.a asc, R.b desc, S.d (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test orderBy explicit columns of local variables from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T tau k.a asc, k.b desc, j.d (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,	 a,		d, 	 100
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy implicit column of relation', function (assert) {
	const query = 'gamma ; count(a)->n (R)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		n
		5
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit column of relation', function (assert) {
	const query = 'gamma ; count(R.a)->n (R)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		n
		5
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy implicit column of relation from local variable', function (assert) {
	const query = 'k = R gamma ; sum(a)->n (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		n
		19
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit column of relation from local variable', function (assert) {
	const query = 'k = R gamma ; sum(R.a)->n (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		n
		19
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit column of local variable', function (assert) {
	const query = 'k = R gamma ; sum(k.a)->n (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		n
		19
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy implicit columns of relations from natural join', function (assert) {
	const query = 'gamma a; max(d)->m (R ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   100
		3,   400
		4,   200
		5,   200
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit columns of relations from natural join', function (assert) {
	const query = 'gamma R.a; max(S.d)->m (R ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   100
		3,   400
		4,   200
		5,   200
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy implicit columns of relations from natural join of local variable and relation', function (assert) {
	const query = 'k = R j = S gamma a; max(d)->m (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   100
		3,   400
		4,   200
		5,   200
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit columns of relations from natural join of local variable and relation', function (assert) {
	const query = 'k = R j = S gamma R.a; max(S.d)->m (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   100
		3,   400
		4,   200
		5,   200
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit columns of local variables from natural join of local variable and relation', function (assert) {
	const query = 'k = R j = S gamma k.a; max(S.d)->m (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   100
		3,   400
		4,   200
		5,   200
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy implicit columns of relations from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S gamma a; max(d)->m (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   100
		3,   400
		4,   200
		5,   200
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit columns of relations from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S gamma R.a; max(S.d)->m (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   100
		3,   400
		4,   200
		5,   200
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit columns of relation and local variable from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S gamma R.a; max(j.d)->m (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   100
		3,   400
		4,   200
		5,   200
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit columns of relations from natural join of local variables', function (assert) {
	const query = 'k = R j = S gamma R.a; max(S.d)->m (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   100
		3,   400
		4,   200
		5,   200
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit columns of local variables from natural join of local variables', function (assert) {
	const query = 'k = R j = S gamma k.a; max(j.d)->m (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   100
		3,   400
		4,   200
		5,   200
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy implicit columns of relations from cross join of multiple relations', function (assert) {
	const query = 'k = R j = S z = T gamma a; count(c)->m (R x S x T)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   20
		3,   20
		4,   20
		5,   20
		6,   20
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit columns of relations from cross join of multiple relations', function (assert) {
	const query = 'k = R j = S z = T gamma T.b; min(S.d)->m (R x S x T)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		T.b, m
		a,   100
		d,   100
		f,   100
		g,   100
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy implicit columns from cross join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T gamma a; count(c)->m (k x j x z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, m
		1,   20
		3,   20
		4,   20
		5,   20
		6,   20
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit columns of relations from cross join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T gamma T.b; min(S.d)->m (k x j x z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		T.b, m
		a,   100
		d,   100
		f,   100
		g,   100
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test groupBy explicit columns of local variables from cross join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T gamma z.b; min(j.d)->m (k x j x z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		T.b, m
		a,   100
		d,   100
		f,   100
		g,   100
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit column(s) of relation', function (assert) {
	const query = 'pi R.a, R.c (R)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		1,   d
		3,   c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of implicit column(s) of relation', function (assert) {
	const query = 'pi a, c (R)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		1,   d
		3,   c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of implicit column(s) of relation from local variable', function (assert) {
	const query = 'k = R pi a, c (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		1,   d
		3,   c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit column(s) of relation from local variable', function (assert) {
	const query = 'k = R pi R.a, R.c (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		1,   d
		3,   c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit column(s) of local variable', function (assert) {
	const query = 'k = R pi k.a, k.c (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		1,   d
		3,   c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of implicit columns of relations from natural join', function (assert) {
	const query = 'pi a, b, c, d (R ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit columns of relations from natural join', function (assert) {
	const query = 'pi R.a, R.b, R.c, S.d (R ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of implicit columns of relations from natural join of local variable and relation', function (assert) {
	const query = 'k = R pi a, b, c, d (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit columns of relations from natural join of local variable and relation', function (assert) {
	const query = 'k = R pi R.a, R.b, R.c, S.d (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit columns of local variable from natural join of local variable and relation', function (assert) {
	const query = 'k = R pi k.a, k.b, k.c, S.d (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of implicit columns of relations from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S pi a, b, c, d (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit columns of relations from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S pi R.a, R.b, R.c, S.d (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit columns of local variable from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S pi R.a, R.b, R.c, j.d (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of implicit columns of relations from natural join of local variables', function (assert) {
	const query = 'k = R j = S pi a, b, c, d (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit columns of relations from natural join of local variables', function (assert) {
	const query = 'k = R j = S pi R.a, R.b, R.c, S.d (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit columns of local variables from natural join of local variables', function (assert) {
	const query = 'k = R j = S pi k.a, k.b, k.c, j.d (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		3,   c,   c,	 400
		4,   d,   f,	 200
		5,   d,   b,	 200
		6,   e,   f,	 150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of implicit columns of relations from natural join of multiple relations', function (assert) {
	const query = 'pi a, b, c, d (R ⨝ S ⨝ T)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of implicit column(s) of local variable from cross join of relations', function (assert) {
	const query = 't = R x S pi a (t)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a
		1
		3
		4
		5
		6
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit column(s) of relation(s) from cross join of relations', function (assert) {
	const query = 't = R x S pi R.a (t)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a
		1
		3
		4
		5
		6
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit column(s) of local variable from cross join of relations', function (assert) {
	const query = 't = R x S pi t.a (t)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a
		1
		3
		4
		5
		6
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit columns of relations from natural join of multiple relations', function (assert) {
	const query = 'pi R.a, R.b, R.c, S.d (R ⨝ S ⨝ T)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of implicit columns from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T pi a, b, c, d (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit columns of relations from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T pi R.a, R.b, R.c, S.d (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test projection of explicit columns of local variables from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T pi k.a, k.b, k.c, j.d (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		1,   a,   d,	 100
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit column(s) of relation', function (assert) {
	const query = 'sigma R.a > 3 (R)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c
		4,   d,   f 
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with implicit column(s) of relation', function (assert) {
	const query = 'sigma a > 3 (R)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c
		4,   d,   f 
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});


QUnit.test('test selection with implicit column(s) of relation from local variable', function (assert) {
	const query = 'k = R sigma a > 3 (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c
		4,   d,   f 
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit column(s) of relation from local variable', function (assert) {
	const query = 'k = R sigma R.a > 3 (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c
		4,   d,   f 
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit column(s) of local variable', function (assert) {
	const query = 'k = R sigma k.a > 3 (k)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c
		4,   d,   f 
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with implicit columns of relations from natural join', function (assert) {
	const query = 'sigma a > 3 and d = 200 (R ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit columns of relations from natural join', function (assert) {
	const query = 'sigma R.a > 3 and S.d = 200 (R ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with implicit columns of relations from natural join of local variable and relation', function (assert) {
	const query = 'k = R sigma a > 3 and d = 200 (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit columns of relations from natural join of local variable and relation', function (assert) {
	const query = 'k = R sigma R.a > 3 and S.d = 200 (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit columns of local variable from natural join of local variable and relation', function (assert) {
	const query = 'k = R sigma k.a > 3 and S.d = 200 (k ⨝ S)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with implicit columns of relations from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S sigma a > 3 and d = 200 (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit columns of relations from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S sigma R.a > 3 and S.d = 200 (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit columns of local variable from natural join of relation and local variable', function (assert) {
	const query = 'k = R j = S sigma R.a > 3 and j.d = 200 (R ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with implicit columns of relations from natural join of local variables', function (assert) {
	const query = 'k = R j = S sigma a > 3 and d >= a*40 (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit columns of relations from natural join of local variables', function (assert) {
	const query = 'k = R j = S sigma R.a > 3 and S.d >= R.a*40 (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit columns of local variables from natural join of local variables', function (assert) {
	const query = 'k = R j = S sigma k.a > 3 and j.d >= k.a*40 (k ⨝ j)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with implicit columns of relations from natural join of multiple relations', function (assert) {
	const query = 'sigma a > 3 and d >= a*40 (R ⨝ S ⨝ T)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit columns of relations from natural join of multiple relations', function (assert) {
	const query = 'sigma R.a > 3 and S.d >= R.a*40 (R ⨝ S ⨝ T)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with implicit columns from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T sigma a > 3 and d >= a*40 (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit columns of relations from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T sigma R.a > 3 and S.d >= R.a*40 (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection with explicit columns of local variables from natural join of multiple local variables', function (assert) {
	const query = 'k = R j = S z = T sigma k.a > 3 and j.d >= k.a*40 (k ⨝ j ⨝ z)';
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, R.c, S.d
		4,   d,   f,	 200
		5,   d,   b,	 200
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of explicit column(s) of relation', function (assert) {
	const query = "pi R.a, R.c (sigma R.b >= 'd' (R))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of implicit column(s) of relation', function (assert) {
	const query = "pi a, c (sigma b >= 'd' (R))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of explicit column(s) of relation from local variable', function (assert) {
	const query = "k = R pi R.a, R.c (sigma R.b >= 'd' (k))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of implicit column(s) of relation from local variable', function (assert) {
	const query = "k = R pi a, c (sigma b >= 'd' (k))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of explicit column(s) of local variable', function (assert) {
	const query = "k = R pi k.a, k.c (sigma k.b >= 'd' (k))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of implicit and explicit column(s) of relation and local variable from local variable', function (assert) {
	const query = "k = R pi k.a, R.c (sigma b >= 'd' (k))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.c
		4,   f
		5,   b
		6,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of explicit column(s) of relations from natural join', function (assert) {
	const query = "pi R.a, S.d (sigma S.d < 200 (R ⨝ S))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of implicit column(s) of relations from natural join', function (assert) {
	const query = "pi a, d (sigma d < 200 (R ⨝ S))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of explicit column(s) of relations from natural join of relation and local variable', function (assert) {
	const query = "j = S pi R.a, S.d (sigma S.d < 200 (R ⨝ j))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of implicit column(s) of relations from natural join of relation and local variable', function (assert) {
	const query = "j = S pi R.a, d (sigma d < 200 (R ⨝ j))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of explicit column(s) of local variable from natural join of relation and local variable', function (assert) {
	const query = "j = S pi R.a, j.d (sigma j.d < 200 (R ⨝ j))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of explicit column(s) of relations from natural join of local variable and relation', function (assert) {
	const query = "k = R pi R.a, S.d (sigma S.d < 200 (k ⨝ S))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of implicit column(s) of relations from natural join of local variable and relation', function (assert) {
	const query = "k = R pi a, d (sigma d < 200 (k ⨝ S))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of explicit column(s) of local variable from natural join of local variable and relation', function (assert) {
	const query = "k = R pi k.a, S.d (sigma S.d < 200 (k ⨝ S))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of explicit column(s) of relations from natural join of local variables', function (assert) {
	const query = "k = R j = S pi R.a, S.d (sigma S.d < 200 (k ⨝ j))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of implicit column(s) of relations from natural join of local variables', function (assert) {
	const query = "k = R j = S pi a, d (sigma d < 200 (k ⨝ j))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of explicit column(s) of local variables from natural join of local variables', function (assert) {
	const query = "k = R j = S pi k.a, j.d (sigma j.d < 200 (k ⨝ j))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of implicit and explicit column(s) of relations and local variables from natural join of local variables', function (assert) {
	const query = "k = R j = S pi a, j.d (sigma S.d < 200 (k ⨝ j))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, S.d
		1,   100
		6,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of implicit and explicit column(s) of relations and local variables from cross cross join of local variables', function (assert) {
	const query = "k = R j = S pi a, R.b, S.b, j.d (sigma k.a>4 and d <= 200 and R.b=S.b (k x j))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, S.b, S.d
		5,   d,   d,   200
		6,   e,   e,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection and projection of implicit and explicit column(s) of relations and local variables from local variable of cross join of variables', function (assert) {
	const query = "k = R j = S t = k x j pi a, R.b, S.b, t.d (sigma t.a>4 and d <= 200 and R.b=S.b (t))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, R.b, S.b, S.d
		5,   d,   d,   200
		6,   e,   e,   150
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test selection, projection, groupBy and orderBy implicit and explicit column(s) of relations and local variables from theta join of multiple variables', function (assert) {
	const query = "k = R j = S z = T t = k ⟗ k.b=S.b j ⟕ j.d<z.d z tau a desc (gamma t.a ; count(t.d)->n (pi a, R.b, S.b, T.d (sigma t.a>4 and S.d <= 200 and R.b=S.b (t))))";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, n
		6,   2
		5,   1
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test generalized projection of implicit column of relation from local variable', function (assert) {
	const query = "t = R pi (a * 2)->doublea (t)";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		doublea
		2
		6
		8
		10
		12
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test generalized projection of explicit column of relation from local variable', function (assert) {
	const query = "t = R pi (R.a * 2)->doublea (t)";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		doublea
		2
		6
		8
		10
		12
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test generalized projection of explicit column of local variable', function (assert) {
	const query = "t = R pi (t.a * 2)->doublea (t)";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		doublea
		2
		6
		8
		10
		12
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test rename implicit column of local variable', function (assert) {
	const query = "t = R rho a->aa (t)";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.aa, R.b, R.c
		1,   a,   d
		3,   c,   c
		4,   d,   f 
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test rename explicit column of relation from local variable', function (assert) {
	const query = "t = R rho R.a->aa (t)";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.aa, R.b, R.c
		1,   a,   d
		3,   c,   c
		4,   d,   f 
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test rename explicit column of local variable', function (assert) {
	const query = "t = R rho t.a->aa (t)";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.aa, R.b, R.c
		1,   a,   d
		3,   c,   c
		4,   d,   f 
		5,   d,   b
		6,   e,   f
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test sqrt negative number', function (assert) {
	const query = "pi a, sqrt(-4)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, k:number
		1,   null
		3,   null
		4,   null
		5,   null
		6,   null
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test sqrt of zero', function (assert) {
	const query = "pi sqrt(0)->k {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k
		0
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test sqrt of one', function (assert) {
	const query = "pi sqrt(1)->k {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k
		1
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test sqrt of one hundred', function (assert) {
	const query = "pi a, sqrt(100)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, k:number
		1,   10
		3,   10
		4,   10
		5,   10
		6,   10
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test e raised to the power of 0', function (assert) {
	const query = "pi a, exp(0)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, k:number
		1,   1
		3,   1
		4,   1
		5,   1
		6,   1
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test e raised to the power of 1', function (assert) {
	const query = "pi a, exp(1)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, k:number
		1,   2.718281828459045
		3,   2.718281828459045
		4,   2.718281828459045
		5,   2.718281828459045
		6,   2.718281828459045
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test e raised to the power of 2', function (assert) {
	const query = "pi exp(2)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k:number
		7.38905609893065
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test column raised to the power of 0', function (assert) {
	const query = "pi a, power(a, 1)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, k:number
		1,   1
		3,   3
		4,   4
		5,   5
		6,   6
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test column raised to the power of 1', function (assert) {
	const query = "pi a, power(a, 1)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, k:number
		1,   1
		3,   3
		4,   4
		5,   5
		6,   6
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test column raised to the power of 2', function (assert) {
	const query = "pi a, power(a, 2)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, k:number
		1,   1
		3,   9
		4,   16
		5,   25
		6,   36
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test natural logarithm of a negative number', function (assert) {
	const query = "pi a, ln(-1)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, k:number
		1,   null
		3,   null
		4,   null
		5,   null
		6,   null
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test natural logarithm of 0', function (assert) {
	const query = "pi a, ln(0)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, k:number
		1,   null
		3,   null
		4,   null
		5,   null
		6,   null
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test natural logarithm of 1', function (assert) {
	const query = "pi a, ln(exp(1))->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		R.a, k:number
		1,   1
		3,   1
		4,   1
		5,   1
		6,   1
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test natural logarithm of 2', function (assert) {
	const query = "pi ln(exp(2))->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k:number
		2
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test logarithm, base 2, of -1', function (assert) {
	const query = "pi log(2, -1)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k:number
		null
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test logarithm, base 2, of 0', function (assert) {
	const query = "pi log(2, -1)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k:number
		null
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test logarithm, base 2, of 1', function (assert) {
	const query = "pi log(2, 1)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k:number
		0
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test logarithm, base -1, of 16', function (assert) {
	const query = "pi log(2, -1)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k:number
		null
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test logarithm, base 0, of 16', function (assert) {
	const query = "pi log(2, -1)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k:number
		null
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test logarithm, base 1, of 16', function (assert) {
	const query = "pi log(1, 16)->k R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k:number
		null
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test logarithm, base 2, of 4', function (assert) {
	const query = "pi log(2, 4)->k {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k:number
		2
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test logarithm, base 10, of 1000', function (assert) {
	const query = "pi round(log(10, 1000))->k {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		k:number
		3
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 2 args comma style', function (assert) {
	const query = "pi SUBSTRING('Quadratically',5) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		'ratically'
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 2 args from style', function (assert) {
	const query = "pi SUBSTRING('foobarbar' FROM 4) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		'barbar'
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 2 args negative pos', function (assert) {
	const query = "pi SUBSTRING('Sakila', -3) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		'ila'
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 3 args comma style', function (assert) {
	const query = "pi SUBSTRING('Quadratically',5,6) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		'ratica'
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 3 args from/for style', function (assert) {
	const query = "pi SUBSTRING('Quadratically' FROM 5 for 6) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		'ratica'
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 3 args negative pos', function (assert) {
	const query = "pi SUBSTRING('Sakila', -5, 3) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		'aki'
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 3 args pos equals to 0', function (assert) {
	const query = "pi SUBSTRING('abcdef', 0, 5) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		'abcde'
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 3 args pos greater than string length', function (assert) {
	const query = "pi SUBSTRING('abcdef', 100, 5) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		''
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 3 args negative length', function (assert) {
	const query = "pi SUBSTRING('abcdef', 5, -3) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		''
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 3 args length equals to 0', function (assert) {
	const query = "pi SUBSTRING('abcdef', 5, 0) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		''
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test substring 3 args length greater than string length', function (assert) {
	const query = "pi SUBSTRING('abcdef', 5, 10) -> str {()}";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string
		'ef'
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});

QUnit.test('test cast function', function (assert) {
	const query = "pi cast(a as string) -> str, cast('100' as number)->n , cast('false' as boolean) -> bool, cast('2025-04-16' as date)->dt R";
	const root = exec_ra(query, getTestRelations());

	const ref = exec_ra(`{
		str:string	n:number	bool:boolean	dt:date
		'1',	100,	false,	2025-04-16
		'3',	100,	false,	2025-04-16
		'4',	100,	false,	2025-04-16
		'5',	100,	false,	2025-04-16
		'6',	100,	false,	2025-04-16
	}`, {});

	assert.deepEqual(root.getResult(), ref.getResult());
});
