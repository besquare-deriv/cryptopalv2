import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment, Pagination } from '@mui/material';
import searchicon from '../Assets/searchicon.svg';
import '../styles/crypto.css';
import searchnotfound from '../Assets/errorsearchresults.svg';
import { useNavigate } from 'react-router-dom';

const tableStyle = {
  borderSpacing: '10px',
  width: '100%',
};

const thStyle = {
  padding: '10px',
  backgroundColor: '#f2f2f2',
};

const tdStyle = {
  padding: '20px',
};

interface CoinData {
  CoinInfo: {
    Id: string;
    ImageUrl: string;
    FullName: string;
    Name: string;
  };
  DISPLAY: {
    USD: {
      PRICE: string;
      CHANGEPCT24HOUR: number;
      HIGH24HOUR: number;
      LOW24HOUR: number;
    };
  };
  RAW: {
    USD: {
      MKTCAP: number;
      VOLUME24HOURTO: number;
    };
  };
}

interface ApiResponse {
  Response: string;
  Data: CoinData[];
  Type: number;
}

const itemsPerPage = 10; // Number of items per page

const MarketTable: React.FC = () => {
  const [data, setData] = useState<CoinData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const navigate=useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=100&tsym=USD'
      );

      const jsonData: ApiResponse = await response.json();
      console.log(jsonData.Data);
      setData(jsonData.Data);
      console.log(jsonData.Data);
      setTotalPages(Math.ceil(jsonData.Data.length / itemsPerPage));
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleHighestButtonClick = () => {
    setSortOrder('desc');
  };

  const handleLowestButtonClick = () => {
    setSortOrder('asc');
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredData = data.filter((coin) =>
    coin.CoinInfo.FullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCarouselItemClick = (coin: CoinData) => {
    navigate(`/coin-details/${coin.CoinInfo.Name}`, { state: { coin } });
    console.log('helloooooo')
  };
  const sortedData = [...filteredData].sort((a, b) => {
    const priceA = parseFloat(a.DISPLAY?.USD?.PRICE) || 0;
    const priceB = parseFloat(b.DISPLAY?.USD?.PRICE) || 0;

    if (sortOrder === 'asc') {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });

  const paginatedData = sortedData.slice(startIndex, endIndex);

  return (
    <div className="cardStyle">
      <div className="market-search">
        <div className="market-tabs">
          <button className="button-tabs" onClick={handleHighestButtonClick}>
            Highest
          </button>
          <button className="button-tabs" onClick={handleLowestButtonClick}>
            Lowest
          </button>
        </div>
        <div className="market-inputbar">
          <TextField
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignSelf: 'flex-end',
              alignContent: 'flex-end',
            }}
            placeholder="Search currency"
            variant="filled"
            value={searchTerm}
            onChange={handleInputChange}
            style={{ marginBottom: '10px', margin: '10px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={searchicon} alt="Search" />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {filteredData.length > 0 ? (
        <table className="tableStyle">
          <thead>
            <tr>
              <th className="thStyle">Currency</th>
              <th className="thStyle">Price</th>
              <th className="thStyle">Status</th>
              <th className="thStyle">Market Cap</th>
              <th className="thStyle">Volume (24h)</th>
            </tr>
          </thead>
          <tbody >
            {paginatedData.map((coin) => (
              <tr key={coin.CoinInfo.Id} >
                <td className="tdStyle">
                  <div className="tableimage-fullname"  onClick={() => handleCarouselItemClick(coin)} >
                    <img
                      src={`https://www.cryptocompare.com${coin.CoinInfo.ImageUrl}`}
                      height="60"
                      style={{ marginBottom: 10 }}
                      alt={coin.CoinInfo.FullName}
                    />
                    <span className="coindetails-symbol2">{coin.CoinInfo.FullName}</span>
                    <span className="markettable-symbol">{coin.CoinInfo.Name}</span>
                  </div>
                </td>
                <td className="tdStyle">{coin.DISPLAY?.USD?.PRICE}</td>
                <td className={coin.DISPLAY?.USD?.CHANGEPCT24HOUR > 0 ? 'positive' : 'negative'}>
                  {coin.DISPLAY?.USD?.CHANGEPCT24HOUR > 0 ? '+' : ''}
                  {coin.DISPLAY?.USD?.CHANGEPCT24HOUR}%
                </td>
                <td className="tdStyle">{coin.RAW?.USD?.MKTCAP}</td>
                <td className="tdStyle">{coin.RAW?.USD?.VOLUME24HOURTO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <img
            src={searchnotfound}
            alt="No results found"
            style={{ height: '20%', width: '30%', marginBottom: '10px' }}
          />
          <span className="error-title">No results found.</span>
        </div>
      )}

      <div className="pagination-pills">
        <Pagination
          count={totalPages}
          page={currentPage + 1}
          onChange={(event, page) => setCurrentPage(page - 1)}
          variant="outlined"
          shape="rounded"
          boundaryCount={2}
        />
      </div>
    </div>
  );
};

export default MarketTable;
