import { uniqueContractAddress } from 'multisigConfig';
const asd = uniqueContractAddress;
const breadcrumbItems: any = {
  decisions: [
    {
      link: '/decisions',
      name: 'Decisions'
    }
  ],
  'multisig/erd1qqqqqqqqqqqqqpgqettaulcsh6afs9h4mhsv44lu28p0rezehdeqk7nttw': [
    {
      link: `/multisig/${uniqueContractAddress}`,
      name: 'Multisig'
    }
  ],
  'address-book': [
    {
      link: '/address-book',
      name: 'Address Book'
    }
  ],
  apps: [
    {
      link: '/apps',
      name: 'Apps'
    }
  ],
  owners: [
    {
      link: '/owners',
      name: 'Owners'
    }
  ],
  cvorum: [
    {
      link: '/cvorum',
      name: 'Cvorum'
    }
  ],
  tokens: [
    {
      link: '/tokens',
      name: 'Tokens'
    }
  ],
  settings: [
    {
      link: '/settings',
      name: 'Settings'
    }
  ],
  'help-center': [
    {
      link: '/help-center',
      name: 'Help Center'
    }
  ],
  'organization-details': [
    {
      link: '/organization-details',
      name: 'Organization Details'
    }
  ],
  'decisions/add-board-member-to-organization': [
    {
      link: '/decisions',
      name: 'Decisions'
    },
    {
      link: '/decisions/add-board-member-to-organization',
      name: 'Add Board Member To Organization'
    }
  ],
  transactions: [
    {
      link: '/transactions',
      name: 'Transactions'
    }
  ]
};

export default breadcrumbItems;
