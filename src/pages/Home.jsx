import React, { useEffect, useState, useCallback, useRef } from "react";
import "../styles/pages/home.css";
import Hero from "../components/Hero";
import Button from "../components/ui/Button";
import { PiStarFill } from "react-icons/pi";
import { LuRefreshCw } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi2";
import { FiEdit3 } from "react-icons/fi";
import { GrMoney } from "react-icons/gr";
import Datagrid from "../components/ui/Datagrid";
import Popup from "../components/ui/Popup";
import { coingecko } from "../api";
import TokenList from "../components/TokenList";
import Loader from "../components/ui/Loader";
import { isSparklinePositive } from "../utils";
import Portal from "../components/Portal";
import Linechart from "../components/charts/Linechart";
import { setWatchList as setReduxWatchlist } from "../store/slices/watchlistSlice";
import { useDispatch, useSelector } from "react-redux";

const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
};

const Home = () => {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [allCoins, setAllCoins] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [selectedWatchList, setSelectedWatchList] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataGridLoading, setDataGridLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [datagridActions, setDataGridActions] = useState({
    id: null,
    edit: false,
    actions: false,
  });
  const [editValue, setEditValue] = useState("");
  const [total, setTotal] = useState(0);
  const [time, setTime] = useState("");
  const [prcentageArray, setPercentageArray] = useState([]);

  const dispatch = useDispatch();

  const { watchlist: reduxWatchList } = useSelector((state) => state);

  const actionRefs = useRef({});

  const page_size = 10;

  useEffect(() => {
    if (reduxWatchList) {
      setSelectedWatchList(reduxWatchList.map((item) => item.id));
    }
  }, []);

  const columns = [
    {
      dataKey: "token",
      label: "Token",
      renderCell: (row) => (
        <div className="watchlist_token">
          <img className="watchlist_token_img" src={row.image} alt={row.name} />
          <span className="watchlist_bright_text">
            {row.name}{" "}
            <span
              style={{
                color: "#A1A1AA",
              }}
            >
              ({row.symbol})
            </span>
          </span>
        </div>
      ),
    },
    {
      dataKey: "current_price",
      label: "Price",
      renderCell: (row) => `$${row.current_price}`,
    },
    {
      dataKey: "price_change_percentage_24h",
      label: "24h %",
    },
    {
      dataKey: "sparkline",
      label: "Sparkline (7d)",
      renderCell: (row) => (
        <div>
          <Linechart
            series={row.sparkline_in_7d}
            color={row.sparklinePositive ? "#32CA5B" : "#FF3A33"}
          />
        </div>
      ),
    },
    {
      dataKey: "holdings",
      label: "Holdings",
      renderCell: (row) => (
        <div>
          {datagridActions.id === row.id && datagridActions.edit ? (
            <div className="watchlist_edit_container">
              <input
                type="number"
                name=""
                id=""
                step="0.1000"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <Button
                onClick={() => {
                  setWatchList((prev) =>
                    prev.map((item) =>
                      item.id === row.id
                        ? { ...item, holdings: Number(editValue).toFixed(4) }
                        : item
                    )
                  );
                  setEditValue("");
                  setDataGridActions({ id: null, edit: false, actions: false });
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="watchlist_bright_text">{row.holdings}</div>
          )}
        </div>
      ),
    },
    {
      dataKey: "value",
      label: "Value",
      renderCell: (row) => (
        <div className="watchlist_bright_text">
          ${(row.current_price * row.holdings).toFixed(2)}
        </div>
      ),
    },
    {
      dataKey: "actions",
      label: "",
      renderCell: (row) => (
        <div
          className="watchlist_action"
          ref={(el) => (actionRefs.current[row.id] = el)}
        >
          <BiDotsHorizontalRounded
            size={15}
            onClick={(e) => {
              e.stopPropagation();
              setEditValue("");
              setDataGridActions((prev) => ({
                id: row.id,
                edit: false,
                actions: prev.id === row.id ? !prev.actions : true,
              }));
            }}
            className="watchlist_action_icon"
          />

          {datagridActions.id === row.id && datagridActions.actions && (
            <Portal>
              <div
                className="watchlist_action_menu"
                style={{
                  top: actionRefs.current[row.id]?.getBoundingClientRect()
                    .bottom,
                  left: actionRefs.current[row.id]?.getBoundingClientRect()
                    .left,
                }}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditValue("");
                    setDataGridActions({
                      id: row.id,
                      edit: true,
                      actions: false,
                    });
                  }}
                  style={{
                    borderBottom: "1px solid #00000014",
                  }}
                >
                  <FiEdit3 size={15} /> <span>Edit Holdings</span>
                </div>
                <div
                  style={{
                    color: "#FDA4AF",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setWatchList((prev) => {
                      return prev.filter((i) => i.id !== row.id);
                    });
                  }}
                >
                  <HiOutlineTrash size={15} color="#FB7185" />{" "}
                  <span>Remove</span>
                </div>
              </div>
            </Portal>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      const clickedOnMenu = e.target.closest(".watchlist_action_menu");
      const clickedOnAction = e.target.closest(".watchlist_action");
      const clickedOnEdit = e.target.closest(".watchlist_edit_container");

      if (clickedOnMenu || clickedOnAction || clickedOnEdit) return;

      if (datagridActions.id !== null) {
        setDataGridActions({ id: null, edit: false, actions: false });
        setEditValue("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [datagridActions.id]);

  const getTrending = useCallback(async () => {
    try {
      const res = await coingecko.trending();
      const formatted = res.coins.map((c) => ({
        id: c.item.id,
        name: c.item.name,
        symbol: c.item.symbol.toUpperCase(),
        image: c.item.small,
      }));
      setTrendingCoins(formatted);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getAllTokens = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);

        const res = await coingecko.markets({
          page,
          per_page: page_size,
        });

        const formatted = res.map((item) => ({
          id: item.id,
          name: item.name,
          symbol: item.symbol?.toUpperCase(),
          image: item.image,
        }));

        setAllCoins((prev) => (reset ? formatted : [...prev, ...formatted]));
        if (res.length < page_size) setHasMore(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  const searchTokens = useCallback(async () => {
    if (!debouncedSearch.trim()) {
      setPage(1);
      setHasMore(true);
      return getAllTokens(true);
    }

    try {
      const res = await coingecko.search(debouncedSearch);
      const mapped = res.coins.map((c) => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol?.toUpperCase(),
        image: c.large,
      }));
      setAllCoins(mapped);
    } catch (err) {
      console.error(err);
    }
  }, [debouncedSearch, getAllTokens]);

  const refreshWatchlist = useCallback(async () => {
    if (selectedWatchList.length === 0) return;

    try {
      setDataGridLoading(true);

      const res = await coingecko.markets({
        ids: selectedWatchList.join(","),
      });

      // Get saved holdings from localStorage
      const savedWatchList =
        JSON.parse(localStorage.getItem("watchList")) || [];

      const formatted = res.map((item) => {
        const saved = savedWatchList.find((i) => i.id === item.id);
        return {
          id: item.id,
          name: item.name,
          symbol: item.symbol.toUpperCase(),
          image: item.image,
          price_change_percentage_24h: `${(
            item.price_change_percentage_24h * 100
          ).toFixed(2)}%`,
          sparkline_in_7d: item.sparkline_in_7d?.price || [],
          sparklinePositive: isSparklinePositive(
            item.sparkline_in_7d?.price || []
          ),
          holdings: saved ? saved.holdings : (1.0).toFixed(4),
          current_price: Number(item.current_price).toFixed(2),
        };
      });

      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setWatchList(formatted);
      setTime(currentTime);
    } catch (err) {
      console.error(err);
    } finally {
      setDataGridLoading(false);
    }
  }, [selectedWatchList]);

  useEffect(() => {
    if (popupOpen) {
      setPage(1);
      setHasMore(true);
      getTrending();
      getAllTokens(true);
    }
  }, [popupOpen]);

  useEffect(() => {
    if (popupOpen) searchTokens();
  }, [debouncedSearch]);

  useEffect(() => {
    if (page > 1 && hasMore && !search) {
      getAllTokens();
    }
  }, [page]);

  useEffect(() => {
    refreshWatchlist();
  }, [selectedWatchList]);

  const handleSelectToken = (id) => {
    setSelectedTokens((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 60) {
      if (!loading && hasMore && !search) {
        setPage((p) => p + 1);
      }
    }
  };

  const handlePopupOpen = () => {
    setPopupOpen(true);
    setSelectedTokens(selectedWatchList);
  };

  const handleApply = () => {
    setSelectedWatchList(selectedTokens);
    handlePopupClose();
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setSearch("");
  };

  useEffect(() => {
    const total = watchList.reduce((sum, item) => {
      const price = Number(item.current_price);
      const holdings = Number(item.holdings);
      return sum + price * holdings;
    }, 0);

    setTotal(total);

    const percentageArray = watchList.map((item) => {
      const price = Number(item.current_price);
      const holdings = Number(item.holdings);
      const value = price * holdings;

      return {
        name: `${item.name} (${item.symbol})`,
        percentage: (total === 0 ? 0 : (value / total) * 100).toFixed(2),
      };
    });

    setPercentageArray(percentageArray);

    if (watchList.length > 0) {
      const dataToSave = watchList.map((item) => ({
        id: item.id,
        holdings: item.holdings,
      }));
      //   localStorage.setItem("watchList", JSON.stringify(dataToSave));
      dispatch(setReduxWatchlist(dataToSave));
    } else {
      localStorage.removeItem("watchList");
    }
  }, [watchList]);

  return (
    <div className="home_wrapper">
      <Hero total={total} time={time} percentages={prcentageArray} />

      <div className="watchlist_wrapper">
        <div className="watchlist_header">
          <div className="watchlist_header_title">
            <PiStarFill size={20} color="#A9E851" />
            <span className="watchlist_header_text">WatchList</span>
          </div>

          <div className="watchlist_header_actions">
            <Button
              varient="bordered"
              icon={<LuRefreshCw size={15} />}
              onClick={refreshWatchlist}
              responsive={true}
            >
              Refresh Prices
            </Button>

            <Button icon={<FaPlus size={15} />} onClick={handlePopupOpen}>
              Add Token
            </Button>
          </div>
        </div>

        <div className="watchlist_datagrid">
          <Datagrid
            columns={columns}
            rows={watchList}
            nodata={{
              icon: <GrMoney size={48} color="#A1A1AA" />,
              text: "No Current Holdings",
            }}
            pagination={{ pageSize: page_size }}
            datagridLoading={dataGridLoading}
          />
        </div>
      </div>

      <Popup open={popupOpen} onClose={handlePopupClose}>
        <div className="wishlist_popup">
          <input
            className="wishlist_popup_search"
            type="text"
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="wishlist_popup_content" onScroll={handleScroll}>
            {!search && (
              <TokenList
                title={loading ? "" : "Trending"}
                tokens={trendingCoins}
                selectedTokens={selectedTokens}
                onSelect={handleSelectToken}
              />
            )}

            <TokenList
              title={loading ? "" : search ? "Search Results" : "All Tokens"}
              tokens={allCoins}
              selectedTokens={selectedTokens}
              onSelect={handleSelectToken}
            />

            {loading && <Loader />}
          </div>

          <div className="wishlist_popup_footer">
            <Button onClick={handleApply}>Apply & Save</Button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Home;
