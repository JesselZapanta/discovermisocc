import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Avatar,
    Button,
    Form,
    message,
    notification,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Upload,
} from "antd";
import Search from "antd/es/input/Search";
import {
    LockOutlined,
    MailOutlined,
    PlusOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
    UploadOutlined,
    CalendarOutlined,
    CodeOutlined,
    CompassOutlined,
} from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import Input from "antd/es/input/Input";
import axios from "axios";
import Column from "antd/es/table/Column";
import TextArea from "antd/es/input/TextArea";

export default function Index({ auth }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");

    const getData = async (isSearch = false) => {
        if (isSearch) {
            setSearching(true);
        }
        setLoading(true);

        const params = [
            `page=${page}`,
            `search=${search}`,
            `sortField=${sortField}`,
            `sortOrder=${sortOrder}`,
        ].join("&");

        try {
            const res = await axios.get(`/admin/city/getdata?${params}`);
            setData(res.data.data);
            setTotal(res.data.total);
        } catch {
            console.log(err);
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    //antd onchange table has 3 params
    const handleTableChange = (pagination, filters, sorter) => {
        setSortField(sorter.field || "id");
        setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
        setPage(pagination.current);
    };

    useEffect(() => {
        getData(false);
    }, [page, sortField, sortOrder]);

    const [city, setCity] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, placement, title, msg) => {
        api[type]({
            message: title,
            description: msg,
            placement: placement,
        });
    };

    const [form] = Form.useForm();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const showEditModal = (city) => {
        setIsModalOpen(true);
        setCity(city);

        form.setFieldsValue({
            code: city.code,
            name: city.name,
            description: city.description,
        });
    };

    const handleSubmit = async (values) => {
        setProcessing(true);

        if (city) {
            try {
                const res = await axios.put(
                    `/admin/city/update/${city.id}`,
                    values
                );
                if (res.data.status === "updated") {
                    handleCancel();
                    openNotification(
                        "success",
                        "bottomRight",
                        "Updated!",
                        "The city has been updated successfully."
                    );
                }
            } catch (err) {
                setErrors(err.response.data.errors);
            } finally {
                setProcessing(false);
            }
        } 
    };

    //cancel modal and form
    const handleCancel = () => {
        setIsModalOpen(false);
        setCity(false);
        form.resetFields();
        setErrors({});
        getData();
    };

    return (
        <AuthenticatedLayout page="City" auth={auth}>
            {contextHolder}
            <Head title="City" />
            <div className="py-2">List of Cities</div>
            <div className="flex gap-2 mb-2">
                <Search
                    placeholder="Input name or code"
                    allowClear
                    enterButton="Search"
                    loading={searching}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={() => getData(true)}
                />
            </div>
            <div className="overflow-x-auto">
                <Table
                    loading={loading}
                    dataSource={data}
                    rowKey={(data) => data.id}
                    pagination={{
                        current: page,
                        total: total,
                        pageSize: 10,
                        showSizeChanger: false,
                        onChange: (page) => setPage(page),
                    }}
                    onChange={handleTableChange}
                >
                    <Column title="ID" dataIndex="id" key="id" />
                    <Column title="CODE" dataIndex="code" key="code" />
                    <Column title="NAME" dataIndex="name" key="name" />
                    <Column
                        title="DESCRIPTION"
                        dataIndex="description"
                        key="description"
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(_, record) => (
                            <Space>
                                <Button
                                    type="primary"
                                    shape="square"
                                    icon={<EditOutlined />}
                                    onClick={() => showEditModal(record)}
                                ></Button>
                                {/* <Button
                                    danger
                                    shape="square"
                                    icon={<DeleteOutlined />}
                                    onClick={() =>
                                        Modal.confirm({
                                            title: "Delete?",
                                            icon: <QuestionCircleOutlined />,
                                            content:
                                                "Are you sure you want to delete this data?",
                                            okText: "Yes",
                                            cancelText: "No",
                                            onOk() {
                                                handleDelete(record.id);
                                            },
                                        })
                                    }
                                /> */}
                            </Space>
                        )}
                    />
                </Table>
            </div>

            <Modal
                title="UPDATE CITY INFORMATION"
                open={isModalOpen}
                onCancel={handleCancel}
                maskClosable={false}
                width={700}
                footer={false}
            >
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="CODE"
                        name="code"
                        // Custom error handling
                        validateStatus={errors?.code ? "error" : ""}
                        help={errors?.code ? errors.code[0] : ""}
                    >
                        <Input disabled prefix={<CodeOutlined />} />
                    </Form.Item>
                    <Form.Item
                        label="NAME"
                        name="name"
                        // Custom error handling
                        validateStatus={errors?.name ? "error" : ""}
                        help={errors?.name ? errors.name[0] : ""}
                    >
                        <Input
                            placeholder="Name"
                            prefix={<CompassOutlined />}
                        />
                    </Form.Item>
                    <Form.Item
                        label="DESCRIPTION"
                        name="description"
                        // Custom error handling
                        validateStatus={errors?.description ? "error" : ""}
                        help={errors?.description ? errors.description[0] : ""}
                    >
                        <TextArea
                            placeholder="City Description"
                            allowClear
                            rows={4}
                        />
                    </Form.Item>
                    <Row justify="end">
                        <Space size="small">
                            <Button type="default" onClick={handleCancel}>
                                Cancel
                            </Button>

                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={<PlusOutlined />}
                                disabled={processing}
                                loading={processing}
                            >
                                {city ? "Update" : "Create"}
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
}
