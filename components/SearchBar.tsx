import { Button, Input } from 'antd';
import { SyncOutlined, UserOutlined } from '@ant-design/icons'
import { useState } from "react";
import { CompleteNameResult } from '../pages/api/completeName';
import { Trie } from '../helper/trie'

const { Search } = Input;

type SearchBarProps = {
    disabled:boolean
    doSearch: any
}


export default function SearchBar({ disabled, doSearch } : SearchBarProps) {

    const [queriesMade, setQueriesMade] = useState<Set<string>>(new Set<string>());
    const [currInput, setCurrInput] = useState<string>("");
    const [[_, trie], setTrie] = useState<[number, Trie]>([0, new Trie()]);

    const autoComplete = async (partial: string) => {
        if (queriesMade.has(partial) || partial.length < 1) {
            return;
        }

        setQueriesMade((set) => {
            return new Set<string>(set.add(partial))
        })

        try {
            const res = await fetch(
               `/api/completeName?partial_name=${partial}`
            );
            const data = await res.json() as CompleteNameResult;
            console.log("Fetched!", partial, data)
            setTrie(([count, trie]): [number, Trie]=> {
                data.names.forEach(n => {
                    trie.add(n);
                })  
                return [count + 1, trie]          
            })

        } catch (err) {
            console.log(err);
        }
    };

    const autocomplete = trie.query(currInput);

    return  <div style={{display:"flex", flexDirection:"row"}}>
        <Button
            onClick={() => doSearch(undefined)}
            disabled={disabled}
            size="large"
            type="primary"
            style={{
                flex: 1,
                marginRight: 10,
                fontSize: 16,
                minWidth: 128,
            }}
        > 
            <SyncOutlined />Random 
        </Button>  
        <div className='SearchBar' style={{flex: 9}}>
            <Search
                disabled={disabled}
                size="large"
                placeholder="Search student name..."
                onSearch={(s)=> {
                    const str = s.toLowerCase();
                    const local = trie.query(str)
                    if (local.length > 0) {
                        doSearch(local[0])
                    } else {
                        doSearch(s)
                    }
                }
            }
                onChange={(s)=> {
                    const input = s.currentTarget.value.toLowerCase();
                    autoComplete(input)
                    setCurrInput(input)
                }}
                style ={{
                    width:      "100%",
                    fontSize:   32
                }}
                prefix={<UserOutlined />}
            />
            {currInput.length > 1 && autocomplete.length > 0 && <div className="Dropdown">
                {autocomplete.splice(0,5).map((n) => 
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
  
  