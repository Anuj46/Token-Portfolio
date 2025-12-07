import React, { useState, useMemo } from "react";
import Loader from "./Loader";
import Button from "./Button";
import "../../styles/components/ui/datagrid.css";

const Datagrid = ({ columns, rows, nodata, datagridLoading, pagination }) => {
  const pageSize = pagination?.pageSize || 10;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(rows.length / pageSize);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return rows.slice(start, end);
  }, [rows, page, pageSize]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="datagrid">
      <div className="datagrid_table_wrapper">
        <table
          className="datagrid_table"
          style={{
            height: (datagridLoading || rows.length === 0) && "100%",
          }}
        >
          <thead className="datagrid_header">
            <tr>
              {columns.map((item, index) => (
                <th
                  key={item.dataKey}
                  style={{
                    paddingLeft: index === 0 && "24px",
                    width: index + 1 === columns.length && "64px",
                  }}
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="datagrid_body">
            {datagridLoading ? (
              <tr>
                <td colSpan={columns.length}>
                  <Loader />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="datagrid_nodata">
                    {nodata.icon}{" "}
                    <span className="datagrid_nodata_text">
                      {nodata.text || "No Data"}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => (
                <tr key={index}>
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.dataKey}
                      style={{ paddingLeft: colIndex === 0 && "24px" }}
                    >
                      {col.renderCell
                        ? col.renderCell(row, index)
                        : row[col.dataKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div className="datagrid_footer">
          <div>
            {`${(page - 1) * pageSize + 1} - ${Math.min(
              page * pageSize,
              rows.length
            )} of ${rows.length} results`}
          </div>

          <div className="datagrid_pagination">
            <span>
              {page} of {totalPages} pages
            </span>
            <Button disabled={page === 1} onClick={handlePrev} varient="link">
              Prev
            </Button>

            <Button
              disabled={page === totalPages}
              onClick={handleNext}
              varient="link"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datagrid;
