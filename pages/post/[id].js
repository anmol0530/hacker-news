import Link from 'next/link';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import data from '../../util/data.json';
import home from "../../public/home.png";
import { timeSince } from '../../util/commonUtils';
import Comment from '../comment/comment';
import Loader from '../loader/loader';

export default function Post() {
    const router = useRouter();
    const { id } = router.query;

    const [post, setPost] = useState('');
    const [commentCount, setCommentCount] = useState(20);
    const [isLoading, setIsLoading] = useState(false);

    const queryAPI = async (id) => {
        try {
            setIsLoading(true);
            const res = await fetch(
                `http://hn.algolia.com/api/v1/items/${id}`
            );
            const data = await res.json();
            // console.log(data);
            setPost(data);
            sessionStorage.setItem(id, JSON.stringify(data))
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    const loadMoreComments = () => {
        setCommentCount(prev => prev + 10);
    }

    useEffect(() => {
        const data = sessionStorage.getItem(id);
        if (data) {
            setPost(JSON.parse(data));
        }
        else if (id) {
            queryAPI(id);
        }
    }, [id, data]);

    return (
        <div className="">
            {isLoading ? (
                <Loader styles="flex justify-center items-center h-screen" />
            ) :
                <>
                    {post &&
                        <div className="pb-6">
                            <div className="bg-[rgb(255,102,0)] sticky flex gap-2 items-center top-0 h-14 py-2 pl-4 font-bold text-3xl">
                                <Link href="/">
                                    <img src={home.src} alt="" className="h-9 cursor-pointer" />
                                </Link>
                                <Link href="/">
                                    <span className='cursor-pointer'>Hacker News</span>
                                </Link>
                            </div>
                            <div className='mb-10 mx-4 flex flex-col'>
                                <div className="mt-8 text-[18px]">
                                    <a href={post.url} target="_blank">{post.title}</a>
                                </div>
                                <div className="mt-4 text-[14px]">
                                    {post.points + " points by "}
                                    <span className="font-bold opacity-100">
                                        {post.author + " "}
                                    </span>
                                    {timeSince(new Date(post.created_at_i)) + " ago"}
                                </div>
                            </div>
                            <div className="mr-8 ml-6 pb-10">
                                {post.children &&
                                    post.children
                                        .filter(child => child.text !== null && child.text !== '')
                                        .slice(0, commentCount)
                                        .map(child => <Comment key={child.id} comment={child} />)
                                }
                            </div>
                            {(commentCount < post.children.length) &&
                                <div
                                    className="cursor-pointer text-[18px] text-center font-bold rounded-md p-3 w-40 mx-auto text-white bg-[rgb(255,102,0)] hover:bg-[rgb(255,55,0)]"
                                    onClick={loadMoreComments}
                                >
                                    Load More
                                </div>
                            }
                        </div>
                    }
                </>
            }
        </div >
    )
}