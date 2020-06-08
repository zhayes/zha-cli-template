import React, { useEffect, useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { baseURL } from '~utils/request';
import { RcFile, UploadProps } from 'antd/lib/upload';

const uploadImg = `${baseURL}/mgt/gov/upload/image`

interface UploadImageProps extends UploadProps {
    maxSize: number,//图片尺寸
    maxQuantity: number,//最多选择多少张图片
    multiple: boolean,
    value?: [],
    action?: string,
}

const UploadImage = ( props:UploadImageProps) => {
    const { maxSize, maxQuantity, multiple, onChange, value, action, disabled } = props;
    const [fileList, setFileList] = useState<any[]>(value || []);
    const [visible, setVisible] = useState(false);
    const [previewImgUrl, setPreviewImgUrl] = useState();

    useEffect(()=>{
        setFileList(value || []);
    }, [value])

    const handleChange = (changeProcess: any) => {
        const { file, fileList } = changeProcess;

        if (file.status === "error") {
            const index = getFileIndex(file);
            fileList.splice(index, 1);

            message.error("上传出错");
        }

        if (file.status === "done") {
            const index = getFileIndex(file);
            index != -1 && (fileList[index].url = file.response.data);
        }

        setFileList(fileList);

        onChange && onChange(fileList);
    }

    const beforeUpload = (file: RcFile, fileList: RcFile[]): Promise<any> => {
        return new Promise((resolve, reject) => {
            const index = getFileIndex(file, fileList);
            if (index + 1 > maxQuantity) {
                message.destroy();
                message.error(`只能最多显示${maxQuantity}张`);
                reject();
            }

            if (file.type.indexOf('image') === -1) {
                message.error(`您应该上传图片文件`);
                reject();
            }

            if (file.size > maxSize * 1024) {
                message.error(`图片大小不能大于${maxSize}kb`);
                const index = fileList.indexOf(file);
                fileList.splice(index, 1);
                setFileList(fileList);
                reject();
            }

            resolve()
        })
    }

    const handelPreview = (file: any) => {
        setPreviewImgUrl(file.url);
        setVisible(true);
    }


    const getFileIndex = (file: RcFile, files = fileList) => {
        for (let i = 0; i < files.length; i++) {
            if (files[i].uid === file.uid) {
                return i;
            }
        };

        return -1;
    }

    const cancelPreview = () => {
        setVisible(false);
    }

    return (
        <div>
            <Upload
                accept="image/*"
                listType="picture-card"
                multiple={multiple}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                onPreview={handelPreview}
                action={action || uploadImg}
                method="post"
                name="file"
                fileList={fileList}
                {...props}
            >
                {
                    fileList.length < maxQuantity ? <PlusOutlined /> : null
                }
            </Upload>

            <Modal
                title="预览图片"
                visible={visible}
                width={800}
                onCancel={cancelPreview}
                footer={false}
            >
                <img src={previewImgUrl} style={{ display: 'block', margin: 'auto', width: '100%' }} />
            </Modal>
        </div>
    )
}

UploadImage.defaultProps = {
    maxQuantity: 8,
    multiple: true,
    maxSize: 1024 * 2, //单位 kb
}


export default UploadImage;