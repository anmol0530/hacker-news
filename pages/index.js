import Head from 'next/head'
import { useState, useRef } from 'react';
import Link from 'next/link';
import { debounce } from '../util/commonUtils';
import Loader from './loader/loader';


export default function Home() {
    const [posts, setPosts] = useState("");
    // const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const ref = useRef('');

    const queryAPI = async (q) => {
        try {
            setIsLoading(true);
            const res = await fetch(
                `http://hn.algolia.com/api/v1/search?query=${q}`
            );
            const data = await res.json();
            setPosts(data.hits);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    const debouncedQuery = debounce(queryAPI, 500);

    const handleChange = (e) => {

        if (e.target.value !== '') {
            debouncedQuery(e.target.value);
        }
        else {
            setPosts("");
        }
    }

    const handleClear = () => {
        // setQuery('');
        ref.current.value = "";
        setPosts('');
    }

    return (
        <div className="flex flex-col items-center text-center min-h-[100vh] relative bg-slate-50">
            <Head>
                <title>Hacker News</title>
            </Head>
            <div className="flex justify-center items-center bg-[rgb(255,102,0)] h-[350px] w-full">
                <h1 className='text-black text-9xl font-serif'>Hacker News</h1>
            </div>
            <div className="sticky px-2 top-0 mt-[-28px] bg-slate-200 box-content flex items-center rounded-lg w-8/12">
                <img src='/search.png' className='h-10 opacity-40 rounded-xl'></img>
                <input
                    type="text"
                    className="bg-slate-200 py-[12px] w-full border-none rounded-lg pl-5 placeholder:text-2xl text-2xl outline-none"
                    placeholder="Search posts"
                    // value={query}
                    ref={ref}
                    onChange={handleChange} />
                {ref.current.value && <img src='/black-cross.png' className='h-8 cursor-pointer' onClick={handleClear} />}
            </div>
            {isLoading ? (
                // <p className="mt-8 h-[19vh]">Loading...</p>
                <Loader styles="flex mt-[16vh]"/>
            ) :
                <>
                    {
                        posts ? (
                            <div className="w-8/12 text-left mt-[20px] mb-52" >
                                {posts.filter(post => post.title !== null && post.title !== '').map((post) => <Link key={post.objectID} href={"/post/" + post.objectID}><p className="cursor-pointer py-5 mx-4 border-b-2 hover:text-[18px] hover:font-bold" onClick>{post.title}</p></Link>)}
                            </div>
                        ) :
                            <div className="p-10 opacity-40 font-bold text-[18px] leading-normal">
                                <h1>
                                    Welcome to Hacker News, a social news website focusing on computer science and entrepreneurship.
                                </h1>
                                You can start searching by using the search bar above!
                            </div>

                    }
                </>
            }
            <footer className='mb-4 mt-[20px] absolute bottom-0 p-2 self-auto'>
                <p className="mb-4 font-bold text-[17px] opacity-40">Find more on</p>
                <div className="flex gap-2 text-[15px]">
                    <a href="https://github.com/anmol0530/hacker-news" target="_blank">
                        <div className="flex bg-[rgb(238,238,238)] rounded-xl px-3 py-2 items-center font-bold gap-2">
                            <img src="./github.png" alt="" className="h-[24px]" />
                            github
                        </div>
                    </a>
                    <a href="https://www.linkedin.com/in/anmoljulka/" target="_blank">
                        <div className="flex bg-[rgb(238,238,238)] rounded-xl px-3 py-2 items-center font-bold gap-2">
                            <img src="./linkedin.png" alt="" className="h-[24px]" />
                            linkedIn
                        </div>
                    </a>
                </div>
            </footer>
        </div >
    )
}