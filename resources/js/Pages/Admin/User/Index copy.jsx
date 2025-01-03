import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Button,
    Form,
    Modal,
    Input,
    Table,
    Space,
    notification,
    Row,
    Select,
    Upload,
    message,
    Avatar,
    Divider,
    Tag,
    DatePicker,
} from "antd";

import {
    MailOutlined,
    LockOutlined,
    UserOutlined,
    PlusOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
    EditOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import Column from "antd/es/table/Column";
import Search from "antd/es/input/Search";

export default function Index({ auth }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);

    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");

    const [tempAvatar, setTempAvatar] = useState("");
    const [isUpload, setIsUpload] = useState(false);

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
            const res = await axios.get(`/admin/user/getdata?${params}`);

            // console.log(res.data);
            setData(res.data.data);
            setTotal(res.data.total);
        } catch (err) {
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

    //modals and forms
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form] = Form.useForm();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const showCreateModal = () => {
        setUser(null);
        setIsModalOpen(true);
        form.setFieldsValue({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "",
            status: "",
        });
    };

    const showEditModal = (user) => {
        const avatar = user.avatar
            ? [
                  {
                      uid: "-1",
                      name: user.avatar,
                      url: `/storage/avatars/${user.avatar}`,
                  },
              ]
            : [];

        setUser(user);
        setIsModalOpen(true);

        form.setFieldsValue({
            name: user.name,
            email: user.email,
            password: "",
            password_confirmation: "",
            role: user.role,
            status: user.status,
            avatar: avatar,
        });
    };

    const { props } = usePage();
    const csrfToken = props.auth.csrf_token || "";

    const removeAvatar = (avatar) => {
        axios.post(`/avatar-temp-remove/${avatar}`).then((res) => {
            if (res.data.status === "remove") {
                message.success("Avatar removed.");
                setIsUpload(false);
            }
            if (res.data.status === "error") {
                alert("error");
            }
        });
    };

    const Uploadprops = {
        name: "avatar",
        action: "/avatar-temp-upload",
        headers: {
            "X-CSRF-Token": csrfToken,
        },

        beforeUpload: (file) => {
            const isPNG = file.type === "image/png";
            const isJPG = file.type === "image/jpeg";

            if (!isPNG && !isJPG) {
                message.error(`${file.name} is not a png/jpg file.`);
            }
            return isPNG || isJPG || Upload.LIST_IGNORE;
        },

        onChange(info) {
            if (info.file.status === "done") {
                // Ensure the upload is complete
                if (user) {
                    axios
                        .post(`/avatar-image-replace/${user.id}/${user.avatar}`)
                        .then((res) => {
                            if (res.data.status === "replace") {
                                message.success("File Replaced");
                            }
                        });
                } else {
                    message.success("Avatar uploaded successfully.");
                    setTempAvatar(info.file.response);
                    setIsUpload(true);
                }
            } else if (info.file.status === "error") {
                message.error("Avatar upload failed.");
            }
        },

        onRemove(info) {
            // Prevent removal if user exists
            if (user) {
                message.error("You cannot remove the avatar.");
                return false; // Prevent file removal
            }

            removeAvatar(info.response);
            return true;
        },
    };

    const handleSubmit = async (values) => {
        setProcessing(true);

        if (!user) {
            try {
                const res = await axios.post("/admin/user/store", values);

                if (res.data.status === "created") {
                    openNotification(
                        "success",
                        "bottomRight",
                        "Created!",
                        "The user has been created successfully."
                    );
                }
            } catch (err) {
                // console.log(err);
                setErrors(err.response.data.errors);
            } finally {
                setProcessing(false);
            }
        } else {
            try {
                const res = await axios.put(
                    `/admin/user/update/${user.id}`,
                    values
                );

                if (res.data.status === "updated") {
                    openNotification(
                        "success",
                        "bottomRight",
                        "Updated!",
                        "The user has been updated successfully."
                    );
                }
            } catch (err) {
                setErrors(err.response.data.errors);
            } finally {
                setProcessing(false);
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setErrors({});
        setUser(null);
        getData();

        if (isUpload) {
            removeAvatar(tempAvatar);
        }
    };

    const handleDelete = async (id) => {
        setProcessing(true);

        try {
            const res = await axios.delete(`/admin/user/delete/${id}`);

            if (res.data.status === "deleted") {
                getData();
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
            setProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout page="User Management" auth={auth}>
            <Head title="User Management" />

            {contextHolder}

            <div className="flex gap-2 mb-2">
                <Search
                    placeholder="Input name or email"
                    allowClear
                    enterButton="Search"
                    // loading={searching}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={() => getData(true)}
                />

                <Button
                    type="primary"
                    size="medium"
                    onClick={showCreateModal}
                    icon={<PlusOutlined />}
                >
                    New
                </Button>
            </div>
            <Table
                // loading={loading}
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
                    dataIndex="avatar"
                    key="avatar"
                    render={(avatar) => (
                        <Avatar
                            size="large"
                            src={`/storage/avatars/${avatar}`}
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
                <Column
                    sorter={true}
                    title="Email"
                    dataIndex="email"
                    key="email"
                />
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
                    title="Action"
                    key="action"
                    render={(_, record) => (
                        <Space>
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={() => showEditModal(record)}
                            ></Button>
                            <Button
                                danger
                                shape="circle"
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
            {/* Modal */}
            <Modal
                title={user ? "EDIT USER INFORMATION" : "USER INFORMATION"}
                open={isModalOpen}
                onCancel={handleCancel}
                maskClosable={false}
                width={800}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label="NAME"
                        name="name"
                        // Custom error handling
                        validateStatus={errors?.name ? "error" : ""}
                        help={errors?.name ? errors.name[0] : ""}
                    >
                        <Input placeholder="Name" prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item
                        label="EMAIL"
                        name="email"
                        validateStatus={errors?.email ? "error" : ""}
                        help={errors?.email ? errors?.email[0] : ""}
                    >
                        <Input
                            placeholder="Email"
                            // size="large"
                            prefix={<MailOutlined />}
                        />
                    </Form.Item>

                    <div className="flex gap-4">
                        <Form.Item
                            label="ROLE"
                            name="role"
                            validateStatus={errors?.role ? "error" : ""}
                            help={errors?.role ? errors?.role[0] : ""}
                            className="w-full"
                        >
                            <Select
                                options={[
                                    { value: 0, label: "Admin" },
                                    { value: 1, label: "User" },
                                    { value: 2, label: "Facilator" },
                                    { value: 3, label: "Entrepreneur" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="STATUS"
                            name="status"
                            validateStatus={errors?.status ? "error" : ""}
                            help={errors?.status ? errors?.status[0] : ""}
                            className="w-full"
                        >
                            <Select
                                options={[
                                    { value: 0, label: "Active" },
                                    { value: 1, label: "Inactive" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="TYPE"
                            name="type"
                            validateStatus={errors?.type ? "error" : ""}
                            help={errors?.type ? errors?.type[0] : ""}
                            className="w-full"
                        >
                            <Select
                                options={[
                                    { value: 0, label: "Domestic" },
                                    { value: 1, label: "International" },
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <div className="flex gap-4">
                        <Form.Item
                            label="REGION"
                            name="region"
                            validateStatus={errors?.region ? "error" : ""}
                            help={errors?.region ? errors?.region[0] : ""}
                            className="w-full"
                        >
                            <Select
                                options={[
                                    { value: 0, label: "Admin" },
                                    { value: 1, label: "User" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="PROVINCE"
                            name="province"
                            validateStatus={errors?.province ? "error" : ""}
                            help={errors?.province ? errors?.province[0] : ""}
                            className="w-full"
                        >
                            <Select
                                options={[
                                    { value: 0, label: "Admin" },
                                    { value: 1, label: "User" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="CITY"
                            name="city"
                            validateStatus={errors?.city ? "error" : ""}
                            help={errors?.city ? errors?.city[0] : ""}
                            className="w-full"
                        >
                            <Select
                                options={[
                                    { value: 0, label: "Admin" },
                                    { value: 1, label: "User" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="BARANGAY"
                            name="barangay"
                            validateStatus={errors?.barangay ? "error" : ""}
                            help={errors?.barangay ? errors?.barangay[0] : ""}
                            className="w-full"
                        >
                            <Select
                                options={[
                                    { value: 0, label: "Admin" },
                                    { value: 1, label: "User" },
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="BIRTHDATE"
                        name="birthdate"
                        validateStatus={errors?.birthdate ? "error" : ""}
                        help={errors?.birthdate ? errors?.birthdate[0] : ""}
                        className="w-full"
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="PASSWORD"
                        name="password"
                        validateStatus={errors?.password ? "error" : ""}
                        help={errors?.password ? errors?.password[0] : ""}
                    >
                        <Input.Password
                            placeholder="Password"
                            type="password"
                            // size="large"
                            prefix={<LockOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="RE-TYPE PASSWORD"
                        name="password_confirmation"
                        validateStatus={
                            errors?.password_confirmation ? "error" : ""
                        }
                        help={
                            errors?.password_confirmation
                                ? errors?.password_confirmation[0]
                                : ""
                        }
                    >
                        <Input.Password
                            placeholder="Re-type Password"
                            type="password"
                            // size="large"
                            prefix={<LockOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="AVATAR"
                        name="avatar"
                        valuePropName="fileList"
                        className="w-full"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        validateStatus={errors?.avatar ? "error" : ""}
                        help={errors?.avatar ? errors.avatar[0] : ""}
                    >
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            {...Uploadprops}
                        >
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
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
                                {user ? "Update" : "Create"}
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
}
