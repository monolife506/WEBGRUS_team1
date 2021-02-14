import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dropzone from "react-dropzone";
import AddIcon from "@material-ui/icons/Add";
import { withRouter } from "react-router-dom";

// import Chip from "@material-ui/core/Chip";
// import Autocomplete from "@material-ui/lab/Autocomplete";

import { useDispatch, useSelector } from "react-redux";
import { fileUpload } from "../_actions/postAction";

function Newpost(props) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentTag, setCurrentTag] = useState(""); //현재 작성중인 태그
  const [tags, setTags] = useState([]); //작성한 태그들 배열

  useEffect(() => {
    //썸네일 주소 삭제
    return () => {
      window.URL.revokeObjectURL(thumbnails);
    };
  }, []);

  const onTitle = (e) => {
    setTitle(e.target.value);
  };

  const onDescription = (e) => {
    setDescription(e.target.value);
  };

  const onCurrentTag = (e) => {
    setCurrentTag(e.target.value);
  };

  const onTagKeyPress = (e) => {
    if (e.key === "Enter") onTagClick();
  };

  //태그 추가하기
  const onTagClick = () => {
    if (currentTag) {
      if (tags.length > 9) {
        alert("태그는 10개까지 입력하실 수 있습니다.");
      } else {
        setTags([...tags, currentTag]);
      }
      setCurrentTag("");
    }
  };

  //파일저장 및 썸네일 생성
  const onDrop = (files) => {
    if (files.length > 6) {
      alert("파일은 최대 6개까지 업로드 할 수 있습니다.");
    } else {
      setFiles(files);
      setThumbnails(files.map((file) => URL.createObjectURL(file)));
    }
  };

  //썸네일 보여주기
  const ThumbnailView = thumbnails.map((thumb) => (
    <div
      key={thumb}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "150px",
        height: "150px",
        border: "dashed 1px gray",
        margin: "0 10px 0 10px",
      }}
    >
      <img
        src={thumb}
        name='thumbnail'
        style={{
          maxWidth: "150px",
          maxHeight: "150px",
          width: "auto",
          height: "auto",
        }}
      />
    </div>
  ));

  //파일들 서버로 보내기
  const OnFileUpload = (e) => {
    e.preventDefault();

    //제목과 파일은 필수
    //설명과 태그는 선택
    if (!title) {
      alert("제목이 필요합니다!");
    } else if (files.length === 0) {
      alert("파일 업로드가 필요합니다!");
    } else {
      //FormData에 파일정보 저장하기
      const formdata = new FormData();

      formdata.append("title", title);

      files.forEach((file) => {
        formdata.append("photos", file);
      });

      if (description) formdata.append("description", description);
      if (tags.length > 0) {
        tags.forEach((tag) => {
          formdata.append("tags", tag);
        });
      }

      dispatch(fileUpload(formdata)).then((res) => {
        //업로드 성공시 업로드된 페이지로 이동
        if (res) {
          props.history.push("/mypage");
        } else {
          alert("업로드에 실패했습니다.");
        }
      });
    }
  };

  let doubleSubmit = true;

  //중복 제출 방지
  const BlockDoubleSubmit = (e) => {
    //첫 제출
    if (doubleSubmit) {
      OnFileUpload(e);
      doubleSubmit = false;
    } else {
      alert("제출 중 입니다");
      return false;
    }
  };

  //input style
  const Textfield = {
    margin: "5px 0 10px 0",
    width: "40vw",
    minWidth: "400px",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>UPLOAD</h1>
      <TextField
        style={Textfield}
        required
        id='standard-required'
        label='제목'
        variant='outlined'
        onChange={onTitle}
      />
      <TextField
        style={Textfield}
        id='standard-multiline-static'
        label='작품소개'
        multiline
        rows={4}
        variant='outlined'
        onChange={onDescription}
      />
      {/* 태그입력창 */}
      <div>
        <TextField
          id='standard-multiline-static'
          value={currentTag}
          name='tag'
          label='태그'
          variant='outlined'
          onChange={onCurrentTag}
          onKeyPress={onTagKeyPress}
        />
        <Button
          type='button'
          onClick={onTagClick}
          variant='contained'
          color='primary'
        >
          추가
        </Button>
        {/* 태그를 추가하면 태그 나타내기 */}
        {tags
          ? tags.map((tag) => (
              <div key={tag}>
                #{tag}
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    const deleteTag = tag;
                    setTags(tags.filter((tag) => tag !== deleteTag));
                  }}
                >
                  삭제
                </button>
              </div>
            ))
          : ""}
      </div>
      <Dropzone accept='image/*' onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5vh",
            }}
          >
            <div
              {...getRootProps()}
              style={{
                width: "40vw",
                height: "30vh",
                minWidth: "400px",
                minHeight: "100px",
                backgroundColor: "lightgray",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "dashed 3px gray",
              }}
            >
              <input {...getInputProps()} />
              <AddIcon />
              <p style={{ margin: "3vh 0 3vh 0" }}>
                이미지 파일을 선택하거나 끌어다 놓으세요
              </p>
              <p style={{ fontSize: "12px", margin: 0 }}>
                (파일은 최대 6개까지 업로드 할 수 있습니다.)
              </p>
            </div>
          </section>
        )}
      </Dropzone>
      <div
        style={{
          margin: "5vh 0 5vh 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "1000px",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        {ThumbnailView}
      </div>
      <Button
        type='submit'
        variant='contained'
        color='primary'
        onClick={BlockDoubleSubmit}
      >
        올리기
      </Button>
    </div>
  );
}

export default withRouter(Newpost);
