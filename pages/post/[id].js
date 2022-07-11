import Link from 'next/link';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { timeSince } from '../../utils/commonUtils';
import Comment from '../../components/comment/comment';
import Loader from '../../components/loader/loader';
import { home } from '../../public/images';

export default function Post() {
    const router = useRouter();
    const { id } = router.query;

    const [post, setPost] = useState('');
    const [commentCount, setCommentCount] = useState(15);
    const [isLoading, setIsLoading] = useState(false);

    const queryAPI = async (id) => {
        try {
            setIsLoading(true);
            const res = await fetch(
                `https://hn.algolia.com/api/v1/items/${id}`
            );
            const data = await res.json();
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
    }, [id]);

    return (
        <div className="">
            {isLoading ? (
                <Loader styles="flex justify-center items-center h-screen" />
            ) :
                <>
                    {post &&
                        <div className="pb-6 mobile:pb-2 break-words">
                            <div className="bg-[rgb(255,102,0)] sticky flex gap-2 top-0 h-14 py-2 pl-4 font-bold text-3xl">
                                <Link href="/">
                                    <img src={home.src} alt="" className="h-9 cursor-pointer" />
                                </Link>
                                <Link href="/">
                                    <span className='cursor-pointer'>Hacker News</span>
                                </Link>
                            </div>
                            <div className='mb-10 mx-4 flex flex-col'>
                                <div className="mt-8 text-[18px]">
                                    {post.url
                                        ?
                                        <a className="hover:text-blue-800 hover:font-semibold" href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a>
                                        :
                                        <p className=''>{post.title}</p>
                                    }
                                </div>
                                <div className="mt-4 text-[14px]">
                                    {post.points + " points by "}
                                    <span className="font-bold opacity-100">
                                        {post.author + " "}
                                    </span>
                                    {timeSince(new Date(post.created_at_i)) + " ago"}
                                </div>
                            </div>
                            <div className="mr-8 mobile:mr-4 ml-4 tab:ml-3 mobile:ml-2 pb-10 mobile:pb-4">
                                {post.children &&
                                    post.children
                                        .filter(child => child.text !== null && child.text !== '')
                                        .slice(0, commentCount)
                                        .map(child => <Comment key={child.id} comment={child} />)
                                }
                            </div>
                            {(commentCount < post.children.length) &&
                                <div
                                    className="cursor-pointer text-[18px] mobile:text-[14px] text-center font-bold rounded-md p-3 mobile:p-2 w-40 mx-auto text-white bg-[rgb(255,102,0)] hover:bg-[rgb(255,55,0)]"
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