/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { rules } from '../../src/Rules'
import { validate } from '../fixtures/rules/index'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { requiredIfExistsAny } from '../../src/Validations/existence/requiredIfExistsAny'

function compile (fields: string[]) {
  return requiredIfExistsAny.compile('literal', 'string', rules.requiredIfExistsAny(fields).options)
}

test.group('Required If Exists Any', () => {
  validate(requiredIfExistsAny, test, undefined, 'foo', compile(['id', 'type']), {
    tip: {
      id: 1,
    },
  })

  test('do not compile when args are not defined', (assert) => {
    const fn = () => requiredIfExistsAny.compile('literal', 'string')
    assert.throw(fn, 'requiredIfExistsAny: The 3rd arguments must be a combined array of arguments')
  })

  test('do not compile when fields are not defined', (assert) => {
    const fn = () => requiredIfExistsAny.compile('literal', 'string', [])
    assert.throw(fn, 'requiredIfExistsAny: expects an array of "fields"')
  })

  test('do not compile when fields are not defined as an array', (assert) => {
    const fn = () => requiredIfExistsAny.compile('literal', 'string', ['foo'])
    assert.throw(fn, 'requiredIfExistsAny: expects "fields" to be an array')
  })

  test('compile with options', (assert) => {
    assert.deepEqual(requiredIfExistsAny.compile('literal', 'string', [['foo']]), {
      name: 'requiredIfExistsAny',
      allowUndefineds: true,
      async: false,
      compiledOptions: { fields: ['foo'] },
    })
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate(null, compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        user_id: 1,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExistsAny',
      message: 'requiredIfExistsAny validation failed',
    }])
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate(undefined, compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExistsAny',
      message: 'requiredIfExistsAny validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate('', compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExistsAny',
      message: 'requiredIfExistsAny validation failed',
    }])
  })

  test('work fine when all of the target fields are undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate('', compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when all of target fields are null or undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate('', compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        user_id: null,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation matches and field has value', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate('hello', compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})
