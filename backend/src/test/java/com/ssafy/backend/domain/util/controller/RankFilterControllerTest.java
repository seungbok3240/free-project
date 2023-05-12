package com.ssafy.backend.domain.util.controller;

import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.ssafy.backend.domain.util.dto.LanguageResponse;
import com.ssafy.backend.domain.util.service.NotificationManager;
import com.ssafy.backend.domain.util.service.RankFilterService;
import com.ssafy.backend.global.auth.filter.TokenAuthenticationFilter;
import com.ssafy.backend.global.config.sercurity.SecurityConfig;
import com.ssafy.backend.global.exception.ControllerAdvisor;
import com.ssafy.backend.global.response.ResponseService;

@WebMvcTest(controllers = RankFilterController.class
	, excludeFilters = {@ComponentScan.Filter(
	type = FilterType.ASSIGNABLE_TYPE,
	classes = {SecurityConfig.class, TokenAuthenticationFilter.class, NotificationManager.class,
		ControllerAdvisor.class}
)
})
@DisplayName("랭킹 필터 테스트")
class RankFilterControllerTest {

	@Autowired
	MockMvc mvc;

	@MockBean
	private ResponseService responseService;

	@MockBean
	private RankFilterService rankFilterService;

	@Test
	// @WithMockUser(username = "test")
	@DisplayName("언어 목록 조회 테스트 - 백준")
	void rankFilterControllerBojTest() throws Exception {
		//given
		String type = "baekjoon";
		List<LanguageResponse> languageResponseList = new ArrayList<>();
		languageResponseList.add(createLanguageResponse(1L, "C++17"));
		languageResponseList.add(createLanguageResponse(2L, "JAVA17"));
		languageResponseList.add(createLanguageResponse(3L, "PYTHON3"));
		languageResponseList.add(createLanguageResponse(4L, "PYPY3"));

		given(rankFilterService.getLanguageList(type))
			.willReturn(languageResponseList);

		//when
		ResultActions actions = mvc.perform(get("/filter/language?type=" + type)
			.contentType(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.characterEncoding("UTF-8"));

		//then
		actions
			.andExpect(MockMvcResultMatchers.status().isOk())
			.andExpect(MockMvcResultMatchers.content().string("test"));

	}

	@Test
	@DisplayName("언어 목록 조회 테스트 - 깃허브")
	void rankFilterControllerGithubTest() {
		//given

		//when

		//then

	}

	@Test
	@DisplayName("언어 목록 조회 테스트 - 잘못된 파라미터")
	void rankFilterControllerFailTest() {
		//given

		//when

		//then

	}

	public LanguageResponse createLanguageResponse(long languageId, String name) {

		return LanguageResponse.builder()
			.languageId(languageId)
			.name(name)
			.build();
	}

}