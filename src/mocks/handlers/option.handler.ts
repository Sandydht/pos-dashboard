import { http, HttpResponse } from 'msw';
import { db } from '../indexed-db/app.db';
import { decrypt } from '../utils/crypto';
import { Country } from '../../app/shared/models/country.model';
import { parseSortField } from '../utils/parse-sort-field';
import { parseSortOrder } from '../utils/parse-sort-order';
import { Province } from '../../app/shared/models/province.model';
import { createSortValueGetter } from '../utils/create-sort-value-getter';
import { PaginationQuery } from '../../app/shared/models/pagination-query.model';
import { SortOrder } from '../../app/shared/models/sort-order.model';
import { paginateArray } from '../utils/paginate-array';
import { City } from '../../app/shared/models/city.model';

import CountriesData from '../datas/countries.data.json';
import ProvincesData from '../datas/provinces.data.json';
import CitiesData from '../datas/cities.data.json';

const ALLOWED_SORT_FIELDS = ['name'] as const;
type ProvinceAndCitySortField = (typeof ALLOWED_SORT_FIELDS)[number];

export const optionHandlers = [
  http.get('/api/countries', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decryptedToken = decrypt(token);
    const user = await db.users.get(decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const result: Country[] = CountriesData as unknown as Country[];
    return HttpResponse.json(result, { status: 200 });
  }),

  http.get('/api/countries/:countryId/provinces', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decryptedToken = decrypt(token);
    const user = await db.users.get(decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { countryId } = params;
    if (!countryId) {
      return HttpResponse.json({ message: 'Invalid countryId' }, { status: 400 });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 10);
    const sortBy = parseSortField<ProvinceAndCitySortField>(
      url.searchParams.get('sortBy'),
      ALLOWED_SORT_FIELDS,
      'name',
    );
    const sortOrder = parseSortOrder(url.searchParams.get('sortOrder'));
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';

    let provinces = ProvincesData;

    provinces = provinces.filter((province: Province) => province.countryId === countryId);

    if (search) {
      provinces = provinces.filter((province: Province) =>
        province.name.toLowerCase().includes(search),
      );
    }

    const getProvinceSortValue = createSortValueGetter<Province, ProvinceAndCitySortField>({
      name: (e) => e.name.toLowerCase() ?? '',
    });

    provinces.sort((a, b) => {
      const aValue = getProvinceSortValue(a, sortBy);
      const bValue = getProvinceSortValue(b, sortBy);

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const query: PaginationQuery = {
      page: Number(page),
      size: Number(size),
      search,
      sortBy: sortBy as ProvinceAndCitySortField,
      sortOrder: sortOrder as SortOrder,
    };
    const result = paginateArray<Province>(provinces, query);

    return HttpResponse.json(result, { status: 200 });
  }),

  http.get('/api/provinces/:provinceId/cities', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decryptedToken = decrypt(token);
    const user = await db.users.get(decryptedToken);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { provinceId } = params;
    if (!provinceId) {
      return HttpResponse.json({ message: 'Invalid provinceId' }, { status: 400 });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 10);
    const sortBy = parseSortField<ProvinceAndCitySortField>(
      url.searchParams.get('sortBy'),
      ALLOWED_SORT_FIELDS,
      'name',
    );
    const sortOrder = parseSortOrder(url.searchParams.get('sortOrder'));
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';

    let cities = CitiesData;
    cities = cities.filter((city: City) => city.provinceId === provinceId);

    if (search) {
      cities = cities.filter((city: City) => city.name.toLowerCase().includes(search));
    }

    const getCitySortValue = createSortValueGetter<City, ProvinceAndCitySortField>({
      name: (e) => e.name.toLowerCase() ?? '',
    });

    cities.sort((a, b) => {
      const aValue = getCitySortValue(a, sortBy);
      const bValue = getCitySortValue(b, sortBy);

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const query: PaginationQuery = {
      page: Number(page),
      size: Number(size),
      search,
      sortBy: sortBy as ProvinceAndCitySortField,
      sortOrder: sortOrder as SortOrder,
    };
    const result = paginateArray<City>(cities, query);

    return HttpResponse.json(result, { status: 200 });
  }),
];
