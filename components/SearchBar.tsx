import { Button, Input, Spin} from 'antd';
import { SyncOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons'
import { useState } from "react";
import { CompleteNameResult } from '../pages/api/completeName';

const { Search } = Input;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

type SearchBarProps = {
    disabled:boolean
    doSearch: any
}


export default function SearchBar({ disabled, doSearch } : SearchBarProps) {

    const [optionsMap, setOptionsMap] = useState<Map<string,string[]>>(new Map<string,string[]>());
    const [currInput, setCurrInput] = useState<string>("");

    const autoComplete = async (partial: string) => {
        console.log(partial, optionsMap.get(partial));
        if (optionsMap.has(partial) || partial.length < 1) {
            return;
        }

        try {
            const res = await fetch(
               `/api/completeName?partial_name=${partial}`
            );
            const data = await res.json() as CompleteNameResult;
            console.log("Fetched!", partial, data)

            setOptionsMap((map) => {
                return new Map(map.set(partial, data.names));
            });
        } catch (err) {
            console.log(err);
        }
    };

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
                    console.log(str, optionsMap.has(str));
                    if (optionsMap.has(str)) {
                        doSearch((optionsMap.get(str) as string[])[0])
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
            {optionsMap.has(currInput) && (optionsMap.get(currInput) || []).length > 0 && <div className="Dropdown">
                {(optionsMap.get(currInput) || []).map((n) => 
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
  
  