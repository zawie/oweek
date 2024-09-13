import { Tree, TreeNode } from 'react-organizational-chart';
import { Orientation, StudentCardGroup } from './StudentCardGroup'
import { Button } from 'antd';
import { Family } from '../helper/family';
import { CardType } from './StudentCard';

type FamilyTreeProps = {
    scope: Scope
    doSearch: any
}

export type Scope = {
    focus: string

    parents: string[]      //  Parents of this family
    siblings: string[]     //  Your siblings and their children
    kids: string[]         //  Your siblings and their children
    personToSubFamilies: Map<string, Array<Family>>
}

function FamilyTree(props: FamilyTreeProps) {
    const { scope, doSearch} = props;

    let elements: string[] = [];
    elements = elements.concat(scope.siblings);
    elements.push(scope.focus);
    elements.sort();

    return <div style={{
            overflowY:"auto",
        }}>
        <Tree label={StudentCardGroup(scope.parents, doSearch, false, "Advisors")}>
            {elements.map((e:string) => (e != scope.focus) 
                ? ( (scope.personToSubFamilies.get(e)?.length || 0 > 0)
                    ? <TreeNode key={e} label={StudentCardGroup([e], doSearch, false)}>
                        {scope.personToSubFamilies.get(e)?.map(f => 
                            <TreeNode key={f.name +"_"+ e} label=
                            {StudentCardGroup(
                                f.kids, 
                                doSearch, 
                                false, 
                                f.year.toString(),
                                f.college,
                                Orientation.VERTICAL, 
                                CardType.MINOR)}                           />
                        )}
                      </TreeNode>
                    : <TreeNode key={e} label={StudentCardGroup([e], doSearch, false)}/>
                  )
                : <TreeNode key={e} label={StudentCardGroup([e], doSearch, true)}>
                    {e == scope.focus && scope.kids.map(kid =>
                        (scope.personToSubFamilies.get(kid)?.length || 0 > 0)
                        ? <TreeNode key={kid} label={StudentCardGroup([kid], doSearch, false)}>
                            {scope.personToSubFamilies.get(kid)?.map(f => 
                                <TreeNode key={f.name +"_"+ kid} label=
                                {StudentCardGroup(
                                    f.kids, 
                                    doSearch, 
                                    false, 
                                    f.year.toString(),
                                    f.college,
                                    Orientation.VERTICAL, 
                                    CardType.MINOR)}
                            />
                            )}
                          </TreeNode>
                        : <TreeNode key={kid} label={StudentCardGroup([kid], doSearch, false)}/>
                    )}
                </TreeNode>
            )}
        </Tree>
    </div>
}

export default FamilyTree