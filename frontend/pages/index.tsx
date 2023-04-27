import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Splash from './splash';
import RankMenu from '@/components/common/RankMenu';
import SearchBar from '@/components/rank/RankSearchBar';
import FilterIcon from '../public/Icon/FilterIcon.svg';
import MainUserItem from '@/components/rank/MainUserItem';
import MainOtherItem from '@/components/rank/MainOtherItem';
import NoAccount from '@/components/rank/NoAccount';
import RankMenuSelectModal from '@/components/common/RankMenuSelectModal';
import LoginModal from '@/components/login/LoginModal';
import BojModal from '@/components/login/BojModal';
import FilterModal from '@/components/rank/FilterModal';
import { useDispatch, useSelector } from 'react-redux';
import { SplashState, splashCheck } from '@/redux/splashSlice';
import { RootState } from '@/redux';
import { getBojRanking, getGithubRanking, getMyBojRanking, getMyGitRanking } from './api/rankAxios';
import { resultInformation } from '@/components/rank/IRank';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .content-wrapper {
    /* position: relative;   */
    position: absolute;
    z-index: 1;
    bottom: 0;
    /* margin-top: 32px; */
    /* padding: 72px 32px 32px; */
    padding: 5rem 2rem 2rem;
    width: 100%;
    /* height: 672px; */
    height: 80vh;
    background-color: ${(props) => props.theme.bgWhite};
    border-radius: 50px 50px 0px 0px;
    display: flex;
    flex-direction: column;

    .filter-box {
      position: absolute;
      top: 2rem;
      right: 2rem;
      cursor: pointer;
    }

    .my-rank {
      p {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
      }
      margin-bottom: 32px;
    }

    .rank-list {
      p {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
      }

      li {
        margin-bottom: 8px;
      }
    }
  }
`;

const Main = () => {
  // login 상태값 가져오기
  const isLogin = useSelector<RootState>((selector) => selector.authChecker.isLogin);

  // splash 상태관리
  const splashState = useSelector<RootState>((selector) => selector.splashChecker.check);
  const dispatch = useDispatch();
  // splash screen 적용하기
  // const [splash, setSplash] = useState<boolean>(false);
  const [splash, setSplash] = useState<boolean>(false);

  // 랭크 menu select 모달 열기
  const [openSelect, setOpenSelect] = useState<boolean>(false);
  // 로그인 모달 열기
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  // 백준 모달 열기
  const [opeBoj, setOpenBoj] = useState<boolean>(false);
  // filter 모달 열기
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  /**
   * splash check useEffect
   */
  useEffect(() => {
    const splashStorage = localStorage.getItem('splash');
    if (splashStorage) {
      setSplash(true);
    }

    if (isLogin) {
      setOpenBoj(true);
    }

    const timer = setTimeout(() => {
      // setSplash(true);
      dispatch(splashCheck());
      localStorage.setItem('splash', 'true');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 깃허브인지 백준인지 상태값 0: 깃허브, 1: 백준
  const [curRank, setCurRank] = useState<number>(0);
  const onChangeCurRank = (el: number) => {
    setCurRank(el);
    setOpenSelect(false);
  };

  // TODO 이렇게 타입을 일일이 써줘야 하나..
  /**
   * 깃허브 랭크 리스트, 백준 랭크 리스트
   */
  const [gitRankList, setGitRankList] = useState<resultInformation>();
  const [bojRankList, setBojRankList] = useState<resultInformation>();

  /**
   *  나의 깃허브 랭킹, 나의 백준 랭킹
   */
  const [myGitRank, setMyGitRank] = useState<{
    userId: number;
    nickname: string;
    rank: number;
    score: number;
    avatarUrl: string;
    rankUpDown: number;
  }>();
  const [myBojRank, setMyBojRank] = useState<{
    userId: number;
    nickname: string;
    rank: number;
    score: number;
    avatarUrl: string;
    rankUpDown: number;
    tierUrl: string;
  }>();

  /**
   * 랭킹 api
   */
  useEffect(() => {
    if (curRank == 0) {
      // 깃허브 랭크 가져오기 => rank 갱신할 때마다 rank값 수정해서 보내기
      (async () => {
        const data = await getGithubRanking(5, 1);
        setGitRankList(data);
      })();

      // 나의 깃허브 랭킹 가져오기
      if (isLogin) {
        (async () => {
          const data = await getMyGitRanking();

          setMyGitRank(data.data.githubRankingCover);
        })();
      }
    } else {
      // 백준 랭크 가져오기
      (async () => {
        // const data = await getBojRanking();
        // console.log(data);
        // setBojRankList(data);
      })();

      // 나의 백준 랭킹 가져오기
      if (isLogin) {
        (async () => {
          const data = await getMyBojRanking();

          setMyBojRank(data.data);
        })();
      }
    }
  }, [curRank]);

  if (!splash && !splashState) {
    // if (splashStorage) {
    return <Splash />;
  } else {
    return (
      <>
        <Wrapper>
          <RankMenu onClick={() => setOpenSelect(true)} curRank={curRank} />
          <SearchBar curRank={curRank} setGitRankList={setGitRankList} setBojRankList={setBojRankList} />
          <div className="content-wrapper">
            <div className="filter-box">
              <FilterIcon onClick={() => setOpenFilter(true)} />
            </div>
            <div className="my-rank">
              <p>나의 랭킹</p>
              {myGitRank && curRank == 0 ? (
                <MainUserItem curRank={curRank} item={myGitRank} />
              ) : myBojRank && curRank == 1 ? (
                <MainUserItem curRank={curRank} item={myBojRank} />
              ) : (
                <NoAccount curRank={curRank} onClick={() => setOpenLogin(true)} />
              )}
            </div>
            <ul className="rank-list">
              <p>전체 랭킹</p>
              {curRank == 0
                ? gitRankList?.map((el, idx) => (
                    <li key={idx}>
                      <MainOtherItem curRank={curRank} item={el} />
                    </li>
                  ))
                : bojRankList?.map((el, idx) => (
                    <li key={idx}>
                      <MainOtherItem curRank={curRank} item={el} />
                    </li>
                  ))}
            </ul>
          </div>
        </Wrapper>
        {openSelect && <RankMenuSelectModal onClick={() => setOpenSelect(false)} onChangeCurRank={onChangeCurRank} />}
        {openLogin && <LoginModal onClick={() => setOpenLogin(false)} setOpenBoj={setOpenBoj} />}
        {opeBoj && <BojModal onClick={() => setOpenBoj(false)} />}
        {openFilter && <FilterModal onClick={() => setOpenFilter(false)} curRank={curRank} />}
      </>
    );
  }
};

export default Main;
