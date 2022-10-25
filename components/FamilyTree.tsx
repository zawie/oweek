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

    let elements: string[] = [];
    elements = elements.concat(scope.siblings);
    elements.push(scope.focus);
    elements.sort();

    return <div style={{
            overflowY:"auto"
        }}>
        <Tree label={StudentCardGroup(scope.parents, doSearch, false, "Advisors")}>
            {elements.map((e:string) => (e != scope.focus) 
                ? <TreeNode key={e} label={StudentCardGroup([e], doSearch, false)}/>
                : <TreeNode key={e} label={StudentCardGroup([e], doSearch, true)}>
                    {e == scope.focus && scope.kids.map(kid =>
                        <TreeNode key={kid} label={StudentCardGroup([kid], doSearch, false)}/>
                    )}
                </TreeNode>
            )}
        </Tree>
    </div>
}

export default FamilyTree