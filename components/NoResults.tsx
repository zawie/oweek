import { UsergroupAddOutlined } from '@ant-design/icons';
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
                href="/create"
                size="large"
                style={{
                    fontSize: 16,
                    minWidth: 128,
            }}> <UsergroupAddOutlined/> Add Family </Button>
        </Empty>
    </div>
}