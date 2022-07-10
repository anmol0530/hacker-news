import Link from 'next/link';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import data from '../../util/data.json';
import home from "../../public/home.png";

function timeSince(date) {

    var seconds = Math.floor((new Date() - date * 1000) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
// var aDay = 24 * 60 * 60 * 1000;
// console.log(timeSince(new Date(Date.now() - aDay)));
// console.log(timeSince(new Date(Date.now() - aDay * 2)));

function Comment({ comment }) {
    const [isClosed, setIsClosed] = useState(false);
    const nestedComments = (comment.children || []).map(comment => {
        return <Comment key={comment.id} comment={comment} type="child" />
    })

    return (<>
        {comment.text &&
            <div className='border-l-4 border-[rgba(255,102,0,0.39)] pl-6 pt-6 ml-6 mt-6'>
                <div className='flex mb-4 text-xs items-center cursor-pointer' onClick={() => setIsClosed(prev => !prev)}>
                    <div className='mr-4 font-bold'>{comment.author}</div>
                    <div>{timeSince(new Date(comment.created_at_i)) + " ago"}</div>
                    {comment.children.length && <div className="font-bold text-2xl ml-4">{isClosed ? "+" : "-"}</div>}
                </div>
                <div dangerouslySetInnerHTML={{ __html: comment.text }}></div>
                {!isClosed && nestedComments}
            </div>
        }
    </>
    )
}

export default function Post() {
    const router = useRouter();
    const { id } = router.query;

    // const [post, setPost] = useState('');
    const [post, setPost] = useState(data);
    const [isLoading, setIsLoading] = useState(false);

    const queryAPI = async (id) => {
        try {
            setIsLoading(true);
            const res = await fetch(
                `http://hn.algolia.com/api/v1/items/${id}`
            );
            const data = await res.json();
            console.log(data);
            setPost(data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     if (id) {
    //         queryAPI(id);
    //     }
    // }, [id]);

    return (
        <div className="">
            {isLoading ? (
                <p className="loading">Loading...</p>
            ) :
                <>
                    {post &&
                        <div className="mb-6">
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
                                    <a href={post.url} target="_blank">{post.title + " (" + post.url + ")"}</a>
                                </div>
                                <div className="mt-4 opacity-80 text-[14px]">
                                    {post.points + " points by "}
                                    <span className="font-bold opacity-100">
                                        {post.author + " "}
                                    </span>
                                    {timeSince(new Date(post.created_at_i)) + " ago"}
                                </div>
                            </div>
                            <div className="mr-8 pb-10">
                                {post.children &&
                                    post.children
                                        .filter(child => child.text !== null && child.text !== '')
                                        .slice(0, 50)
                                        .map(child => <Comment key={child.id} comment={child} />)
                                }
                            </div>
                        </div>
                    }
                </>
            }
        </div >
    )
}