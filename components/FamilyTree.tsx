import { Tree, TreeNode } from 'react-organizational-chart';
import { StudentCardGroup } from './StudentCardGroup'
import { Button } from 'antd';

type FamilyTreeProps = {
    scope: Scope
    doSearch: any
}

export type Scope = {
    focus:      string
    parents:    string[]
    siblings:   string[]  
    kids:       string[]        
    grandkids:  Map<string,string[]> 
    nephews:   Map<string,string[]> 
}

function FamilyTree(props: FamilyTreeProps) {
    const { scope, doSearch} = props;

    let elements: string[] = [];
    elements = elements.concat(scope.siblings);
    elements.push(scope.focus);
    elements.sort();

    return <div style={{
            overflowY:"auto",
            paddingBottom: 64,
        }}>
        <Tree label={StudentCardGroup(scope.parents, doSearch, false, "medium", "Advisors")}>
            {elements.map((e:string) => (e != scope.focus) 
                ? <TreeNode key={e} label={StudentCardGroup([e], doSearch, false, "medium")}>
                        {scope.nephews.get(e)?.map(nephew => 
                            <TreeNode label={StudentCardGroup([nephew], doSearch, false, "small")} />
                        )}
                    </TreeNode>
                : <TreeNode key={e} label={StudentCardGroup([e], doSearch, true, "large")}>
                    {scope.kids.map(kid =>
                        <TreeNode key={kid} label={StudentCardGroup([kid], doSearch, false, "medium")}>
                            {scope.grandkids.get(kid)?.map(grandkid => 
                                <TreeNode label={StudentCardGroup([grandkid], doSearch, false, "small")} />
                            )}
                        </TreeNode>
                    )}
                </TreeNode>
            )}
        </Tree>
    </div>
}

export default FamilyTree