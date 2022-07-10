import {useRouter} from 'next/router'

export default function Post() {
    const router = useRouter();
    const {id} = router.query;
    return (
        <h2>
            Hello World, {id}
        </h2>
    )
}