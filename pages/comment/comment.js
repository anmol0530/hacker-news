import { useState } from "react";
import { timeSince } from "../../util/commonUtils";
import plus from "../../public/plus.png";
import minus from "../../public/minus.png";


const Comment = ({ comment }) => {
    const [isClosed, setIsClosed] = useState(false);
    const nestedComments = (comment.children || []).map(comment => {
        return <Comment key={comment.id} comment={comment} type="child" />
    })

    return (
        <>
            {comment.text &&
                <div className='border-l-4 border-[rgba(255,102,0,0.39)] pl-6 pt-6 ml-6 mt-6'>
                    <div className='flex mb-4 text-xs items-center cursor-pointer' onClick={() => setIsClosed(prev => !prev)}>
                        <div className='mr-4 font-bold'>{comment.author}</div>
                        <div>{timeSince(new Date(comment.created_at_i)) + " ago"}</div>
                        {comment.children.length !== 0 && <div className="font-bold text-2xl ml-4"><img src={isClosed ? plus.src : minus.src} className="h-3" /></div>}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: comment.text }}></div>
                    {!isClosed && nestedComments}
                </div>
            }
        </>
    )
}

export default Comment;