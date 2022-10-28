import { Tree, TreeNode } from 'react-organizational-chart';
import { StudentCardGroup } from './StudentCardGroup'

type FamilyTreeProps = {
    scope: Scope
    doSearch: any
}

export type Scope = {
    focus: string

    parents: string[]      //  Parents of this family
    siblings: string[]     //  Your siblings and their children
    kids: string[]         //  Your siblings and their children
    hasKids: Map<string, boolean>
}

function FamilyTree(props: FamilyTreeProps) {
    const { scope, doSearch} = props;

    let elements: string[] = [];
    elements = elements.concat(scope.siblings);
    elements.push(scope.focus);
    elements.sort();

    return <div style={{
            overflowY:"auto",
            padding: 25   
        }}>
        <Tree label={StudentCardGroup(scope.parents, doSearch, false, "Advisors")}>
            {elements.map((e:string) => (e != scope.focus) 
                ? ( scope.hasKids.get(e) 
                    ? <TreeNode key={e} label={StudentCardGroup([e], doSearch, false)}>
                        <TreeNode key={e+"_kids"} label={""}/>
                      </TreeNode>
                    : <TreeNode key={e} label={StudentCardGroup([e], doSearch, false)}/>
                  )
                : <TreeNode key={e} label={StudentCardGroup([e], doSearch, true)}>
                    {e == scope.focus && scope.kids.map(kid =>
                        scope.hasKids.get(kid) 
                        ? <TreeNode key={kid} label={StudentCardGroup([kid], doSearch, false)}>
                            <TreeNode key={kid+"_kids"} label={""}/>
                          </TreeNode>
                        : <TreeNode key={kid} label={StudentCardGroup([kid], doSearch, false)}/>
                    )}
                </TreeNode>
            )}
        </Tree>
    </div>
}

export default FamilyTree