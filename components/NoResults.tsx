import { UserAddOutlined } from '@ant-design/icons';
import { Button, Empty } from 'antd';

type NoResultsProps = {
    searchedTerm: string
}

export default function NoResults(props: NoResultsProps) {
    const { searchedTerm } = props;

    return <div>
        <br/>
        <br/>
        <Empty
        description={
            <span>
                Your search {'"'}{searchedTerm}{'"'} did not match any known students.
            </span>
        }>
            <Button type="link"
                href="https://forms.gle/hUfXkadg8Z8L5Bt98"
                size="large"
                style={{
                    fontSize: 16,
                    minWidth: 128,
            }}> <UserAddOutlined/> Add a family </Button>
        </Empty>
    </div>
}