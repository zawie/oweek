import { Button, Input } from 'antd';
import { SyncOutlined } from '@ant-design/icons'
import { useState } from "react";
import { SuggestResult } from '../pages/api/suggest';
import { Trie } from '../helper/trie'

const { Search } = Input;

type SearchBarProps = {
    disabled:boolean
    doSearch: any
}


export default function SearchBar({ disabled, doSearch } : SearchBarProps) {

    const [queriesMade, setQueriesMade] = useState<Set<string>>(new Set<string>());

    const [currInput, setCurrInput] = useState<string>("");

    const [[_s, trie, suggestions], setData] 
        = useState<[number, Trie, Map<string, string[]>]>([0, new Trie(), new Map<string, string[]>()]);

    const autoComplete = async (partial: string) => {
        if (queriesMade.has(partial) || partial.length < 1) {
            return;
        }

        setQueriesMade((set) => {
            return new Set<string>(set.add(partial))
        })

        try {
            const res = await fetch(
               `/api/suggest?query=${partial}`
            );
            const data = await res.json() as SuggestResult;

            setData(([count, trie, map]): [number, Trie,  Map<string, string[]>]=> {
                map.set(partial, [...data.suggestions]);
                data.suggestions.forEach(n => {
                    trie.add(n);
                })  
                return [count + 1, trie, map]          
            })
        } catch (err) {
            console.log(err);
        }
    };

    const completions = suggestions.get(currInput) || trie.query(currInput);

    return  <div style={{display:"flex", flexDirection:"row"}}>
        <Button
            onClick={() => doSearch(undefined)}
            disabled={disabled}
            size="large"
            type="primary"
            className="RandomButton"
        > 
            <SyncOutlined />Random 
        </Button>  
        <div className='SearchBar'>
            <Search
                disabled={disabled}
                size="large"
                placeholder="Student name..."
                onSearch={(s)=> {
                    if (completions.length > 0) {
                        doSearch(completions[0])
                    } else {
                        doSearch(s.toLowerCase())
                    }
                }
            }
                onChange={(s)=> {
                    const input = s.currentTarget.value.toLowerCase();
                    if (input.length > 0)
                        autoComplete(input)
                    setCurrInput(input)
                }}
                style ={{
                    width:      "100%",
                    fontSize:   32
                }}
            />
            {currInput.length > 0 && completions.length > 0 && <div className="Dropdown">
                {completions.slice(0,5).map((n) => 
                <a key={n+"_dropdownentry"} className='DropdownEntry' onClick={()=> doSearch(n)}>
                    {n.toLowerCase()
                        .split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ')}
                </a>)}
            </div>}
        </div>
    </div>
}
  
  