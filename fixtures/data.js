import faker from 'faker';

const ColumnsFixtures = [
  { name: 'Name', selector: 'name', className: 'w-50', sortable: true },
  { name: 'Description', selector: 'description' },
];

const TableFixtures = (size = 1) =>
  new Array(size).fill({}).map(() => ({
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
  }));

export { ColumnsFixtures, TableFixtures };
export default TableFixtures;
