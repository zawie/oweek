import type { NextPage } from 'next'
import React, { useState } from 'react';
import Image from 'next/image';

import { Typography, Button, Checkbox, Form, Input, Divider, InputNumber, Spin, Alert} from 'antd';
import { CrownTwoTone, DeleteColumnOutlined, DeleteFilled, DeleteOutlined, DeleteRowOutlined, DeleteTwoTone, ExclamationCircleOutlined, ExclamationCircleTwoTone, ExclamationOutlined, InfoCircleTwoTone, LoadingOutlined, MinusCircleOutlined, PlusOutlined, QuestionCircleTwoTone, UserAddOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import Radio, { RadioGroupOptionType } from 'antd/lib/radio';
import { time } from 'console';
const { Text, Title } = Typography;

import type { FormProps } from 'antd';
import { colleges, getPresident } from '../helper/rice';

type FamilyType = {
  name?: string;
  year?: number;
  college?: string;
  parents?: string[];
  kids?: string[];
};

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const Create: NextPage = () => {

    const [canSubmit, setCanSubmit] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const onFinish: FormProps<FamilyType>['onFinish'] = async (values) => {
        setSubmitting(true);
        
        console.log('Success:', values);
        const res = await fetch('/api/insert', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })

        setCanSubmit(false);
        setSubmitting(false);
        alert(res.status == 200 ? "Success!" : `Failed to submit family. Please try again.\n\n${res.status}: ${res.statusText}`)
        setCanSubmit(true);
      };
  
      
    const onFinishFailed: FormProps<FamilyType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setCanSubmit(false);
    };

    return <div style={{display: "flex", justifyContent: "center"}}>
        <Form
            name="basic"
            style={{ maxWidth: 2000, margin: 15 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            onChange={() => setCanSubmit(true)}
        >
            <Title level={2}> <UsergroupAddOutlined/> Add or Edit Family </Title>
            <Divider style={{maxWidth: 1500, minWidth: 400}}/>

            <Title level={5}> Family Name </Title>
            <Form.Item<FamilyType>
                name="name"
                rules={[
                    { required: true, message: 'Required' },
                    { max: 50, message: 'Family name must be less than 50 characters'},
                    { min: 3, message: 'Family name must be at least 3 characters'},
                ]}
            >
                <Input placeholder='Cosmic Brownies' type='string'/>
            </Form.Item>

            <Title level={5}> Matriculation Year</Title>
            <Form.Item<FamilyType>
                name="year"
                rules={[
                    { required: true, message: 'Required' },
                    { type: 'number', min: 1912, max: new Date().getFullYear() + 1, message: 'Please a select a reasonable year'}]}
            >
                <InputNumber placeholder="1912" style={{width: "100%"}}/>
            </Form.Item>


            <Title level={5}> Residential College </Title> 
            <Form.Item<FamilyType>
                name="college"
                rules={[{ required: true, message: 'Required' }]}
            >
                <Radio.Group  style={{display: "flex", flexDirection: "column"}} >
                {colleges.map(c => 
                            <Radio name={c} key={c} value={c}> 
                            <Image
                                src={`/assets/emblems/${c.toLowerCase()}.png`}
                                alt="?"
                                key={c}
                                height="20"
                                width="20"
                                style={{marginRight: "5px"}}
                            />
                            {c}
                            {c == 'Brown' && <>{' '} <CrownTwoTone/></>} {/* BSWB! */}
                            </Radio>
                        )}
                </Radio.Group>
            </Form.Item>

            <Divider/> 
            {createFormList("Advisor", "parents")}
            <Divider/>
            {createFormList("New Student", "kids")}
            <Divider/>

            <Form.Item<FamilyType>>
                <Button type="primary" htmlType="submit" disabled={!canSubmit || submitting}>
                    {submitting ? "Submitting... " : "Submit"}
                    {submitting && <Spin indicator={<LoadingOutlined style={{marginLeft: 17, fontSize: 15 }} spin />} />}
                </Button>
            </Form.Item>
        </Form>
    </div>;
}


function createFormList(label: string, variable: string) {
    return  <>         
        <Title level={5}> {label}s </Title> 
        <Text> Please include the first and last name of {label.toLowerCase()}. </Text>
        <br/>
        <br/>
        <Form.List
            name={variable}
            rules={[
                {
                validator: async (_, names) => {
                    if (!names || names.length < 1) {
                    return Promise.reject(new Error(`Add at least one ${label}`));
                    }
                },
                },
            ]}
            >
            {(fields, { add, remove }, { errors }) => (
                <>
                {fields.map((field, index) => (
                    <Form.Item
                    {...formItemLayout}
                    required={true}
                    key={field.key}
                    >
                    <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                        {
                            required: index == 0,
                            whitespace: true,
                            message: `Please input a name or delete this field.`,
                        },
                        ]}
                        noStyle
                    >
                        <Input placeholder={getPresident(index)} style={{ width: '75%' }} />
                    </Form.Item>
                    {fields.length > 1 ? (
                        <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                        />
                    ) : null}
                    </Form.Item>
                ))}
                <Form.Item>
                    <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '75%'}}
                    icon={<PlusOutlined/>}
                    >
                    Add {label}
                    </Button>
                    <Form.ErrorList errors={errors} />
                </Form.Item>
                </>
            )}
        </Form.List>
    </>
}

export default Create;