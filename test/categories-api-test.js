'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');
/*
Test suite for the Categories Api
 */
suite('Categories API tests', function () {

  // Some tests were timing out so higher timeout rate set
  this.timeout(6000);
  let categories = fixtures.category;
  let newCategory = fixtures.newCategory;
  const poiService = new PoiService(fixtures.poiService);
  let newUser = fixtures.newUser;
  let newUserAuth = {
    email: newUser.email,
    password: newUser.password
  }

  suiteSetup(async function() {
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUserAuth);
  });

  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  setup(async function () {
    await poiService.deleteAllCategories();
  });

  teardown(async function ()
  {
    await poiService.deleteAllCategories();
  });

  // Test creating a new category
  test('create a new category', async function () {
   const returnedCategory = await poiService.createCategory(newCategory);
   assert(_.some([returnedCategory], newCategory), 'returnedCategory must be a superset of newCategory');
   assert.isDefined(returnedCategory._id);
  });

  // Test returning a single category
  test('get a single category', async function ()
  {
    const c1 = await poiService.createCategory(newCategory);
    const c2 = await poiService.getCategory(c1._id);
    assert.deepEqual(c1, c2);
  });

  // Test an invalid category returns Null
  test('get invalid category', async function ()
  {
    const c1 = await poiService.getCategory('1234');
    assert.isNull(c1)
    const c2 = await poiService.getCategory('429088498328490328490829489320')
    assert.isNull(c2);
  });

  // test deleting a single category
  test('delete a category', async function() {
    let c = await poiService.createCategory(newCategory);
    assert(c._id != null);
    await poiService.deleteOneCategory(c._id);
    c = await poiService.getCategory(c._id);
    assert(c==null);
  });

  // Test getting all stored categories
  test('get all categories', async function ()
  {
    for(let c of categories){
      await poiService.createCategory(c);
    }
    const allCategories = await poiService.getCategories();
    assert.equal(allCategories.length, categories.length);
  });

  // Test the details of a category are correct
  test('get categories detail', async function ()
  {
    for(let c of categories){
      await poiService.createCategory(c);
    }
    const allCategories = await poiService.getCategories();
    for (var i=0; i<categories.length; i++)
    {
      assert(_.some([allCategories[i]], categories[i]),
        'returnedCategory must be a superset of the newCategory')
    }
  });

  // test for an empty array if there are no stored categories
  test('get all categories empty', async function ()
  {
    const allCategories = await poiService.getCategories();
    assert.equal(allCategories.length, 0);
  });
});