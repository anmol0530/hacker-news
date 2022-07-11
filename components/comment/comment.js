import { useState } from "react";
import { minus, plus } from "../../public/images";
import { timeSince } from "../../utils/commonUtils";


const Comment = ({ comment }) => {
    const [isClosed, setIsClosed] = useState(false);
    const nestedComments = (comment.children || []).map(comment => {
        return <Comment key={comment.id} comment={comment} type="child" />
    })

    return (
        <>
            {comment.text &&
                <div className='border-l-4 mobile:border-l-2 border-[rgba(255,102,0,0.39)] pl-4 tab:pl-4 mobile:pl-3 pt-5 mobile:pt-1 ml-5 tab:ml-3 mobile:ml-1 mt-5 mobile:mt-3 overflow-auto'>
                    <div className='flex mb-4 text-xs items-center cursor-pointer' onClick={() => setIsClosed(prev => !prev)}>
                        <div className='mr-4 font-bold'>{comment.author}</div>
                        <div>{timeSince(new Date(comment.created_at_i)) + " ago"}</div>
                        {comment.children.length !== 0 && <div className="font-bold text-2xl ml-4"><img src={isClosed ? plus.src : minus.src} className="h-3" /></div>}
                    </div>
                    <div className="mobile:text-xs" dangerouslySetInnerHTML={{ __html: comment.text }}></div>
                    {!isClosed && nestedComments}
                </div>
            }
        </>
    )
}

export default Comment;