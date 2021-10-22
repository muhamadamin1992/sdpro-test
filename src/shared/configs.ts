import { Config } from 'src/shared/models';

const configs: Config[] = [
  {
    title: {
      plural: 'Countries',
      singular: 'Country',
    },
    path: '/countries',
    api: 'country',
  },
  {
    title: {
      plural: 'Cities',
      singular: 'City',
    },
    path: '/cities',
    api: 'city',
  },
  {
    title: {
      plural: 'Teams',
      singular: 'Team',
    },
    path: '/teams',
    api: 'team',
  },
];

export default configs;
