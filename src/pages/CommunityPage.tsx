/* Import section */
import { useParams } from "react-router"
import { CommunityDisplay } from "../components/CommunityDisplay"

/* Community page section */
export const CommunityPage = () => {
    const { id } = useParams<{ id: string }>()
    return (
        <div>
            <CommunityDisplay communityId={Number(id)} />
        </div>

    )
}

