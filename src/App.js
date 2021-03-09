import './App.css';
import { useEffect, useState } from 'react';
import { list } from './request';
import info from './info.js';
import { useSelector, useDispatch } from 'react-redux';
import { getList, deletedItem } from './module/list';

function App() {
  const { list, page, deletedItems } = useSelector(({ list }) => ({
    list: list.list,
    page: list.page,
    deletedItems: list.deletedItems,
  }));
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState([]);
  const [filterTypes, setFilterTypes] = useState([
    {
      key: 'died',
      name: '생존인물만',
      checked: false,
      fn: (item) => !item.died,
    },
    {
      key: 'gender',
      name: '여자',
      checked: false,
      fn: (item) => item.gender === 'Female',
    },
    {
      key: 'tvSeries',
      name: 'tvSeries 없음',
      checked: false,
      fn: (item) => item.tvSeries.length < 1 || item.tvSeries.every((txt) => !txt),
    },
  ]);

  // 필터 함수
  const handleFilterItem = (e) => {
    const { value, checked } = e.target;
    // console.log(value, checked);
    setFilterTypes((prev) => prev.map((item) => (item.key === value ? { ...item, checked } : item)));
  };

  const filterList = () => {
    let newList = [...list];

    for (const obj of filterTypes) {
      if (obj.checked) {
        newList = newList.filter((item) => obj.fn(item));
      }
    }

    if (deletedItems.length) {
      newList = newList.filter((item, idx) => item.url !== deletedItems[idx]);
    }
    setFilterData(newList);
  };

  // 초기화 버튼
  const resetData = () => filterList();

  // url param
  const getQueryString = () => {
    let page = window.location.search.substr(1).split('&');

    if (!page[0]) {
      return 1;
    }

    for (let a of page) {
      let arrQuery = a.split('=');

      if (arrQuery[0] === 'page') {
        return parseInt(arrQuery[1], 10);
      }
    }
  };

  const handleBodyScroll = () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
      dispatch(getList(page + 1));
    }
  };

  const deleteItem = (url) => {
    dispatch(deletedItem(url));
    setFilterData(filterData.filter((fItem) => fItem.url !== url));
  };

  useEffect(() => {
    window.addEventListener('scroll', handleBodyScroll);
    return () => window.removeEventListener('scroll', handleBodyScroll);
  }, [handleBodyScroll]);

  useEffect(() => {
    dispatch(getList(getQueryString()));
  }, [dispatch]);

  useEffect(() => {
    if (!list.length) return;
    setFilterData(list);
  }, [list]);

  useEffect(() => {
    filterList();
  }, [filterTypes, page]);

  return (
    <div className='App'>
      {/* <header>무신사 과제</header> */}
      <div className='filter'>
        {filterTypes.map((item, idx) => (
          <label className='toggle' key={idx}>
            <input
              className='toggle__input'
              type='checkbox'
              onChange={handleFilterItem}
              checked={item.checked}
              value={item.key}
            />
            <span className='toggle__img'></span>
            <span className='toggle__txt'>{item.name}</span>
          </label>
        ))}
        <button type='button' onClick={resetData}>
          초기화
        </button>
      </div>
      {filterData && filterData.length > 0 && (
        <ul className='list'>
          {filterData.map((item, idx) => (
            <li className='list__item' key={idx}>
              <div>
                <p>title: {item.titles.toString()}</p>
                <p>name: {item.name}</p>
                <p>died: {item.died}</p>
                <p>gender: {item.gender}</p>
                <p>aliases: {item.aliases.toString()}</p>
                <p>books: {item.books.length}</p>
                <p>tvSeries: {item.tvSeries.length}</p>
              </div>
              <button type='button' onClick={() => deleteItem(item.url)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
