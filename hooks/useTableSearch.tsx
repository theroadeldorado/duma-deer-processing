import React from 'react';
import toast from 'react-hot-toast';
import { get } from 'lib/helpers';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type Options = {
  url: string;
  defaultFilters?: any;
  defaultSortBy: string;
  defaultSortDir?: 'asc' | 'desc';
};

export default function useTableSearch<ResultType>({ url, defaultFilters, defaultSortBy, defaultSortDir = 'desc' }: Options) {
  const queryClient = useQueryClient();

  type State = {
    page: number;
    isPaginating: boolean;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    filters?: any;
  };

  type Result = {
    results: ResultType[];
    total: number;
  };

  const [state, setState] = React.useState<State>({
    page: 1,
    isPaginating: false,
    sortBy: defaultSortBy,
    sortDirection: defaultSortDir,
    filters: defaultFilters,
  });

  const { page, sortBy, sortDirection, filters } = state;

  const { data, isLoading, error } = useQuery<Result>({
    queryKey: [url, { page, sortBy, sortDirection, ...filters }],
    keepPreviousData: true,
  });

  React.useEffect(() => {
    if (state.isPaginating) {
      setState((prev) => ({ ...prev, isPaginating: false }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data]);

  const results = data?.results || [];
  const total = data?.total || 0;

  const nextPage = () => {
    const newPage = page + 1;
    setState((prev) => ({ ...prev, page: newPage, isPaginating: true }));
  };

  const prevPage = () => {
    const newPage = page - 1;
    setState((prev) => ({ ...prev, page: newPage, isPaginating: true }));
  };

  const reload = () => {
    queryClient.invalidateQueries([url]);
  };

  const updateFilters = (filters: any) => {
    setState((prev) => ({ ...prev, filters }));
  };

  const onSort = (sortBy: string, sortDirection: 'asc' | 'desc') => {
    setState((prev) => ({ ...prev, sortBy, sortDirection }));
  };

  const onExport = async () => {
    const toastId = toast.loading('loading...');

    try {
      const res = await get(url, { ...filters, page, sortBy, sortDirection, format: 'csv' });
      window.location.href = res.url;
    } catch (error: any) {
      toast.error(error.message || 'Error exporting data');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const showLoading = isLoading && !results.length;

  return {
    reload,
    updateFilters,
    setState,
    onExport,
    results,
    tableProps: { total, page, sortBy, sortDirection, nextPage, prevPage, onSort, isLoading: showLoading, error: (error as any)?.message },
  };
}
