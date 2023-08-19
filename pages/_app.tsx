import 'antd/dist/antd.css';
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic';

const LoadableApp = dynamic(() =>
  import("../components/LoadableApp").then((m) => m.LoadableApp),
);

function MyApp(props: AppProps) {
    return  <LoadableApp {... props}/>
}

export default MyApp
