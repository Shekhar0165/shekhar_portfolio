import { Helmet } from 'react-helmet-async';
import Terminal from '../components/Terminal';

const Home = () => {
    return (
        <>
            <Helmet>
                <title>ShekharKashyap.dev | Terminal Portfolio</title>
                <meta name="description" content="Interactive terminal-style portfolio. Type 'help' to explore." />
            </Helmet>
            <Terminal />
        </>
    );
};

export default Home;
