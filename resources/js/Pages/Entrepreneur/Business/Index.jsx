import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
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
} from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import Input from "antd/es/input/Input";
import axios from "axios";
import Column from "antd/es/table/Column";
import Create from "./Create";

export default function Index({ auth }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("desc");

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
            const res = await axios.get(
                `/entrepreneur/business/getdata?${params}`
            );
            setData(res.data.data);
            setTotal(res.data.total);
        } catch (err){
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

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, placement, title, msg) => {
        api[type]({
            message: title,
            description: msg,
            placement: placement,
        });
    };

    const handleDelete = async (id) => {
        setLoading(true);

        try {
            const res = await axios.delete(`/admin/user/destroy/${id}`);

            if (res.data.status === "deleted") {
                handleCancel();
                openNotification(
                    "success",
                    "bottomRight",
                    "Deleted!",
                    "The user has been deleted successfully."
                );
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthenticatedLayout page="Business Management" auth={auth}>
            <Head title="Business Management" />
            {contextHolder}
            <div className="py-2">List of Business</div>
            <div className="flex gap-2 mb-2">
                <Search
                    placeholder="Input name or email"
                    allowClear
                    enterButton="Search"
                    loading={searching}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={() => getData(true)}
                />
                <Link href={route("entrepreneur.business-create")}>
                    <Button type="primary" icon={<PlusOutlined />}>
                        New
                    </Button>
                </Link>
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
                    <Column sorter={true} title="ID" dataIndex="id" key="id" />

                    <Column
                        title="Avatar"
                        dataIndex="logo"
                        key="logo"
                        render={(logo) => (
                            <Avatar
                                size="large"
                                src={`/storage/logos/${logo}`}
                                icon={<UserOutlined />}
                            />
                        )}
                    />

                    <Column
                        sorter={true}
                        title="Name"
                        dataIndex="name"
                        key="name"
                    />
{/* 
                    <Column
                        sorter={true}
                        title="Status"
                        dataIndex="status"
                        key="status"
                        render={(_, record) =>
                            record.status === 0 ? (
                                <Tag color="yellow">Inactive</Tag>
                            ) : (
                                <Tag color="green">Active</Tag>
                            )
                        }
                    />

                    <Column
                        sorter={true}
                        title="Type"
                        dataIndex="type"
                        key="type"
                        render={(_, record) =>
                            record.type === 0 ? (
                                <Tag color="geekblue">Domestic</Tag>
                            ) : (
                                <Tag color="purple">International</Tag>
                            )
                        }
                    /> */}

                    <Column
                        title="Action"
                        key="action"
                        render={(_, record) => (
                            <Space>
                                <Button
                                    type="primary"
                                    shape="square"
                                    icon={<EditOutlined />}
                                    onClick={() => router.get(route("entrepreneur.business-edit", record.id))}
                                ></Button>
                                <Button
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
                                />
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </AuthenticatedLayout>
    );
}
