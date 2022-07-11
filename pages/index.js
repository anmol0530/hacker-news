import Head from 'next/head'
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { debounce } from '../utils/commonUtils';
import Loader from '../components/loader/loader';
import { blackCross, github, linkedin, search } from '../public/images';


export default function Home() {
    const [posts, setPosts] = useState("");
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

    const debouncedQuery = debounce(queryAPI, 600);

    const handleChange = (e) => {
        const val = e.target.value;
        ref.current.value = val;
        debouncedQuery(val);
    }

    const handleClear = () => {
        setPosts('');
        ref.current.value = "";
    }

    useEffect(() => {
        if (!ref.current.value && posts) {
            setPosts('');
        }
    }, [posts])

    return (
        <div className="flex flex-col items-center text-center min-h-[100vh] relative bg-slate-50">
            <Head>
                <title>Hacker News</title>
            </Head>
            <div className="flex justify-center items-center bg-[rgb(255,102,0)] h-[330px] w-full">
                <h1 className='text-black font-semibold text-9xl tab:text-8xl mobile:text-7xl px-4'>Hacker News</h1>
            </div>
            <div className="sticky px-2 mobile:px-1 stop-0 mt-[-28px] bg-slate-200 box-content flex items-center rounded-lg w-8/12 mobile:w-10/12">
                <img src={search.src} className='h-10 opacity-40 rounded-xl'></img>
                <input
                    type="text"
                    className="bg-slate-200 py-[12px] w-full border-none rounded-lg pl-5 mobile:pl-2 placeholder:text-2xl text-2xl mobile:text-xl outline-none"
                    placeholder="Search posts"
                    ref={ref}
                    onChange={handleChange} />
                {ref.current.value && <img src={blackCross.src} className='h-8 cursor-pointer' onClick={handleClear} />}
            </div>
            {isLoading ? (
                <Loader styles="flex mt-[16vh]" />
            ) :
                <>
                    {
                        posts ? (
                            <div className="w-8/12 mobile:w-11/12 text-left mt-[20px] h-[45vh] overflow-auto" >
                                {posts
                                    .filter(post => post.title !== null && post.title !== '')
                                    .map((post) =>
                                        <Link
                                            key={post.objectID}
                                            href={"/post/" + post.objectID}>
                                            <p
                                                className="cursor-pointer mobile:text-sm py-4 px-2 mx-4 mb-1 rounded-md mobile:rounded-none mobile:border-b-2 hover:bg-gray-200 hover:rounded-md hover:font-bold"
                                                onClick>{post.title}
                                            </p>
                                        </Link>
                                    )
                                }
                            </div>
                        ) :
                            <div className="p-10 opacity-40 font-bold text-[18px] mobile:text-[14px] leading-normal">
                                <h1>
                                    Welcome to Hacker News, a social news website focusing on computer science and entrepreneurship.
                                </h1>
                                You can start searching by using the search bar above!
                            </div>
                    }
                </>
            }
            {!posts &&
                <footer className='mb-4 absolute bottom-0 p-2 self-auto'>
                    <p className="mb-4 font-bold text-[17px] opacity-40">Find more on</p>
                    <div className="flex gap-2 text-[15px]">
                        <a href="https://github.com/anmol0530/hacker-news" target="_blank" rel="noopener noreferrer">
                            <div className="flex bg-[rgb(238,238,238)] hover:bg-[rgb(200,200,200)] rounded-xl px-3 py-2 items-center font-bold gap-2">
                                <img src={github.src} alt="" className="h-[24px]" />
                                GitHub
                            </div>
                        </a>
                        <a href="https://www.linkedin.com/in/anmoljulka/" target="_blank" rel="noopener noreferrer">
                            <div className="flex bg-[rgb(238,238,238)] hover:bg-[rgb(200,200,200)] rounded-xl px-3 py-2 items-center font-bold gap-2">
                                <img src={linkedin.src} alt="" className="h-[24px]" />
                                LinkedIn
                            </div>
                        </a>
                    </div>
                </footer>
            }
        </div >
    )
}