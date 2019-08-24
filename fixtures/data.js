import faker from 'faker';

const ColumnsFixtures = [
  { name: 'Name', selector: 'name', class: 'w-50', sortable: true },
  { name: 'Description', selector: 'description' },
];

const createTableFixture = (size = 1) =>
  new Array(size).fill({}).map(() => ({
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
  }));

const TableFixtures = createTableFixture(20);

export { ColumnsFixtures, TableFixtures };
export default TableFixtures;
