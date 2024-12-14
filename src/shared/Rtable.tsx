// custom (Datatable) pagination, sorting, filtering 

import { useEffect, useState, useCallback } from 'react';
import {
  useTable,
  usePagination,
  useSortBy,
  Column,
  TableInstance,
  TableState,
  Row,
  TableOptions,
} from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Rtable.module.scss';
import leftButton from '../assets/PaginationLeftButton.svg';
import rightButton from '../assets/PaginationRightButton.svg';
import sortingDiabled from '../assets/sorting-disable.svg';
import AscendingOrder from '../assets/sort-ascending.svg';
import DescendingOrder from '../assets/sort-descending.svg';
import { DOTS3, OF, ONE, PAGE, PAGINATION_OPTIONS, PROJECTS, SHOWING, SLASH, TO } from '../constants/TableConstants';

interface DataTableProps<D extends object> {
  columns: Column<D>[];
  tableType:string;
  fetchData: ({
    pageIndex,
    pageSize,
    sortBy,
    searchString,
    triggerTableApi,
    startDate,
    endDate,
    retryCount,
  }: {
    pageIndex: number;
    pageSize: number;
    sortBy: { id: string; desc: boolean }[];
    searchString: string;
    triggerTableApi: number;
    startDate?:string;
    endDate?:string;
    retryCount?:number;
  }) => Promise<{ rows: D[], totalPages: number, totalRecords:number }>;
  searchString: string;
  triggerTableApi: number;
  startDate: string;
  endDate: string;
}

interface PaginationTableState<D extends object> extends TableState<D> {
  pageIndex: number;
  pageSize: number;
  sortBy: { id: string; desc: boolean }[];
}

interface PaginationTableInstance<D extends object>
  extends Omit<TableInstance<D>, 'state'> {
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: number[];
  pageCount: number;
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (pageSize: number) => void;
  page: Row<D>[];
  state: PaginationTableState<D>;
}

interface ExtendedTableOptions<D extends object> extends TableOptions<D> {
  manualPagination: boolean;
  pageCount: number;
  initialState: Partial<PaginationTableState<D>>;
}

const DataTable = <D extends object>({ columns, fetchData, searchString, triggerTableApi, startDate, endDate, tableType }: DataTableProps<D>) => {
  const [data, setData] = useState<D[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [controlledPageIndex, setControlledPageIndex] = useState(0);
  const [sortBy, setSortBy] = useState<{ id: string; desc: boolean }[]>([]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = useTable<D>(
    {
      columns,
      data,
      manualPagination: true,
      manualSortBy: true,
      pageCount,
      initialState: { pageIndex: 0, pageSize: 10, sortBy: [{ id: 'name', desc: false, }] } as Partial<PaginationTableState<D>>,
      stateReducer: (newState: any, action: { type: string; }) => {
        if (action.type === 'gotoPage') {
          setControlledPageIndex(newState.pageIndex);
        }
        if (action.type === 'toggleSortBy') {
          setSortBy(newState.sortBy);
        }
        return newState;
      },
    } as ExtendedTableOptions<D>,
    useSortBy,
    usePagination
  ) as PaginationTableInstance<D>;

  const { pageSize } = state as PaginationTableState<D>;

  // Wrap fetchData in useCallback to ensure stable reference
  const fetchDataCallback = useCallback(fetchData, []);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const { rows, totalPages, totalRecords } = await fetchDataCallback({
          pageIndex: controlledPageIndex,
          pageSize,
          sortBy,
          searchString,
          startDate,
          endDate,
          triggerTableApi
        });
        setData(rows);
        setPageCount(totalPages);
        setTotalRecord(totalRecords);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, [controlledPageIndex, pageSize, sortBy, searchString, startDate, endDate, triggerTableApi, fetchDataCallback]);

  const handlePageClick = (newPageIndex: number) => {
    if (newPageIndex !== controlledPageIndex) {
      gotoPage(newPageIndex);
    }
  };

  const generatePageNumbers = () => {
    const totalPageCount = pageCount;
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPageCount <= maxVisiblePages) {
      startPage = 0;
      endPage = totalPageCount;
    } else {
      if (controlledPageIndex <= Math.floor(maxVisiblePages / 2)) {
        startPage = 0;
        endPage = maxVisiblePages;
      } else if (controlledPageIndex + Math.floor(maxVisiblePages / 2) >= totalPageCount) {
        startPage = totalPageCount - maxVisiblePages;
        endPage = totalPageCount;
      } else {
        startPage = controlledPageIndex - Math.floor(maxVisiblePages / 2);
        endPage = controlledPageIndex + Math.ceil(maxVisiblePages / 2);
      }
    }

    return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
  };

  const visiblePageNumbers = generatePageNumbers();

  const isNextButtonDisabled = controlledPageIndex >= pageCount - 1;
  
  return (
    <>
    <div className={`${styles['table-section']}`}>
    <div className={`table-responsive ${styles['custom-data-table']}`}>
      <table {...getTableProps()} className={`table ${styles.tableCustom} ${(tableType === 'moduleList') ? tableType :''} ${styles.list}`}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps ? column.getSortByToggleProps() : undefined)}
                  key={column.id}
                >
                  {column.render('Header')}
                  <span className='ms-2'>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <img src={DescendingOrder} />
                        : <img src={AscendingOrder} />
                      : ''}
                      {(column.canSort && column.isSortedDesc == undefined ) && <img src={sortingDiabled} /> }
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {(!data.length && !loading) && (<tr><td className={`${styles['NoDocsfoundtext']}`} colSpan={columns.length}>No Records Found</td></tr>)}
          {loading ? (
            <tr>
              <td colSpan={columns.length}>Loading...</td>
            </tr>
          ) : (
            page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell:any) =>  { 
                    return(
                    <td {...cell.getCellProps()} key={cell.column.id}>{cell.render('Cell')}</td>
                  )}
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
    </div>
    <div className={styles['pagination-section']}>
    {(data.length > 0) &&
      <div className={styles.pageSizeRecords}>
        {SHOWING.showing} {((controlledPageIndex+1) - 1) * pageSize + 1} {TO.to} {Math.min((controlledPageIndex+1) * pageSize, totalRecord)} {OF.of} {totalRecord} {PROJECTS.projects}
      </div>
    }
      <div className={`${styles.paginationCustom}`}>
        <nav>
          <ul className={styles.pagination}>
            <li className={`${styles["page-item"]} ${controlledPageIndex === 0 ? styles.disabled : ''}`} onClick={() => controlledPageIndex > 0 && previousPage()}>
              <button className={`page-link ${styles.paginationText}`} disabled={controlledPageIndex === 0}>
                <img src={leftButton} alt="Previous" />
              </button>
            </li>
            {visiblePageNumbers[0] > 0 && (
              <li className={`${styles["page-item"]}`} onClick={() => handlePageClick(0)}>
                <button className={`page-link ${styles.paginationText}`}>
                  {ONE.one}
                </button>
              </li>
            )}
            {visiblePageNumbers[0] > 1 && (
              <li className={`${styles["page-item"]}`}>
                <button className={`page-link ${styles.paginationText}`} disabled>
                  {DOTS3.dots}
                </button>
              </li>
            )}
            {visiblePageNumbers.map((pageNumber, index) => (
              <li key={index} className={`${styles['page-item']} ${controlledPageIndex === pageNumber ? styles.active : ''}`} onClick={() => handlePageClick(pageNumber)}>
                <button className={`page-link ${styles.paginationText}`}>
                  {pageNumber + ONE.one}
                </button>
              </li>
            ))}
            {visiblePageNumbers[visiblePageNumbers.length - 1] < pageCount - 2 && (
              <li className={`${styles["page-item"]}`}>
                <button className={`page-link ${styles.paginationText}`} disabled>
                  {DOTS3.dots}
                </button>
              </li>
            )}
            {visiblePageNumbers[visiblePageNumbers.length - 1] < pageCount - 1 && (
              <li className={`${styles["page-item"]}`} onClick={() => handlePageClick(pageCount - 1)}>
                <button className={`page-link ${styles.paginationText}`}>
                  {pageCount}
                </button>
              </li>
            )}
            <li className={`${styles["page-item"]} ${isNextButtonDisabled ? styles.disabled : ''}`}>
              <button className={`page-link ${styles.paginationText}`} onClick={() => !isNextButtonDisabled && nextPage()} disabled={isNextButtonDisabled}>
                <img src={rightButton} alt="Next" />
              </button>
            </li>
          </ul>
        </nav>
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className={`form-control ${styles.paginationOption}`}
        >
          {[PAGINATION_OPTIONS.ten, PAGINATION_OPTIONS.twenty, PAGINATION_OPTIONS.thirty, PAGINATION_OPTIONS.fourty].map(size => (
            <option key={size} value={size}>
              {size} {SLASH.slash} {PAGE.Page}
            </option>
          ))}
        </select>
      </div>
      </div>
      </>
    
  );
};

export default DataTable;


