import { Tree, TreeNode } from 'react-organizational-chart';
import { StudentCardGroup } from './StudentCardGroup'

type FamilyTreeProps = {
    scope: Scope
    doSearch: any
}

export type Scope = {
    focus: string

    parents: string[]      //  Parents of this family
    siblings: string[]    //  Your siblings and their children
    kids: string[]         //  Your siblings and their children
}

function FamilyTree(props: FamilyTreeProps) {
    const { scope, doSearch} = props;
    return <div style={{
            overflowY:"auto"
        }}>
        <Tree label={StudentCardGroup(scope.parents, doSearch, false, "Advisors")}>
            <TreeNode key={scope.focus} label={StudentCardGroup([scope.focus], doSearch, true)}>
                {scope.kids.map(kid =>
                    <TreeNode key={kid} label={StudentCardGroup([kid], doSearch, false)}/>
                )}
            </TreeNode>
            {scope.siblings.map(sibling =>
                <TreeNode key={sibling} label={StudentCardGroup([sibling], doSearch, false)}/>
            )}
        </Tree>
    </div>
}

export default FamilyTree