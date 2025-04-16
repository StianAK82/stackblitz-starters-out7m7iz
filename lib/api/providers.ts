import { AccountingProvider } from './types';

export const accountingProviders: AccountingProvider[] = [
  {
    id: 'fiken',
    name: 'Fiken',
    logo: '/images/providers/fiken.svg',
    description: 'Norsk regnskapsprogram for små og mellomstore bedrifter',
    isSupported: true,
  },
  {
    id: 'tripletex',
    name: 'Tripletex',
    logo: '/images/providers/tripletex.svg',
    description: 'Komplett økonomisystem for bedrifter',
    isSupported: true,
  },
  {
    id: 'poweroffice',
    name: 'PowerOffice',
    logo: '/images/providers/poweroffice.svg',
    description: 'Skybasert økonomisystem',
    isSupported: false,
  },
  {
    id: 'conta',
    name: 'Conta',
    logo: '/images/providers/conta.svg',
    description: 'Moderne regnskapsprogram',
    isSupported: true,
  },
];