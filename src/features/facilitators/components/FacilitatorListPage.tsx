import { CenteredLoader } from '@/components/CenteredLoader';
import { ErrorDialog } from '@/components/ErrorDialog';
import { Header } from '@/components/Header';
import { PageTitle } from '@/components/PageTitle';
import { useFacilitators } from '../hooks/useFacilitators';
import { useFacilitatorListState } from '../hooks/useFacilitatorListState';
import { EmptyState } from './EmptyState';
import { FacilitatorTable } from './FacilitatorTable';
import { PaginationBar } from './PaginationBar';
import { SearchInput } from './SearchInput';

export function FacilitatorListPage() {
  const state = useFacilitatorListState();
  const { data, isLoading, isError, isFetching, refetch } = useFacilitators(state.query);

  const totalCount = data?.totalCount ?? 0;
  const facilitators = data?.data ?? [];
  const showEmpty = !isLoading && !isError && totalCount === 0;

  return (
    <div className="min-h-full bg-white">
      <Header />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <PageTitle />
          <SearchInput value={state.searchInput} onChange={state.setSearchInput} />
        </div>

        {showEmpty ? (
          <EmptyState />
        ) : data ? (
          <div className="flex flex-col gap-6">
            <FacilitatorTable
              facilitators={facilitators}
              sort={state.sort}
              order={state.order}
              onToggleSort={state.toggleSort}
            />
            <PaginationBar page={state.page} totalCount={totalCount} onPageChange={state.setPage} />
          </div>
        ) : null}
      </main>

      {isFetching && <CenteredLoader />}
      <ErrorDialog open={isError} onRetry={() => void refetch()} />
    </div>
  );
}
