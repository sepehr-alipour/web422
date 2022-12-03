const PUBLIC_PATHS = ['/login','/register', '/', '/_error'];
import { isAuthenticated } from '../lib/authenticate';
import { useRouter } from 'next/router';
import {useState, useEffect} from 'react';
import { useAtom } from "jotai";
import { searchHistoryAtom, favouritesAtom } from "../store";
import { getFavourites, getHistory } from "../lib/UserData";



export default function RouteGuard(props) {

  async function updateAtoms() {
    favouritesAtom(await getFavourites());
    searchHistoryAtom(await getHistory());
  }

  const router = useRouter();

  const [authorized, setAuthorized] = useState(false)
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  function authCheck(url) {
    const path = url.split('?')[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }

  useEffect(()=>{
    updateAtoms();
    authCheck(router.pathname);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);  

  return <>{authorized && props.children}</>
}