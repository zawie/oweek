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
    const [optionsReady, setOptionsReady] = useState<boolean>(false);

    const autoComplete = async (partial: string) => {
        setOptionsReady(false)
        if (optionsMap.has(partial) || partial.length < 1) {
            setOptionsReady(true)
            return;
        }

        try {
            const res = await fetch(
               `/api/completeName?partial_name=${partial}`
            );
            setOptionsReady(true)
            const data = await res.json() as CompleteNameResult;
            setOptionsMap((map) => {
                return new Map(map.set(partial, data.names));
            });
        } catch (err) {
            console.log(err);
        }
    };

    const showDropdown = !(currInput == "") && (!optionsReady || ((optionsMap).get(currInput) || []).length > 0);

    return  <div style={{display:"flex", flexDirection:"row"}}>
        <Button
            onClick={() => doSearch(undefined)}
            disabled={disabled}
            size="large"
            type="primary"
            style={{
                marginRight: 10,
                fontSize: 16,
                minWidth: 128,
            }}
        > 
            <SyncOutlined />Random 
        </Button>  
        <div className='SearchBar'>
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
            {showDropdown && <div className="Dropdown">
                {optionsMap.has(currInput) 
                    ? (optionsMap.get(currInput) || []).map((n) => 
                    <a className='DropdownEntry' key={n+"_key"}>
                        {n.toLowerCase()
                            .split(' ')
                            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                            .join(' ')}
                    </a>)
                    : <div style={{color:"gray", marginLeft: 5, padding:5}}>
                        <Spin style={{color:"gray", marginRight: 10}} indicator={antIcon} size="small" />
                        Loading...
                    </div>}
            </div>}
        </div>
    </div>
}
  
  