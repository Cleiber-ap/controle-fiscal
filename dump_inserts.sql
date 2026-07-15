--
-- PostgreSQL database dump
--

\restrict 5Yg8Bynzk9CLsXOsi1KIGlVR2fXRC86rRbemdoAmoG5o8Aj4sw2uyYbTme0ZR7E

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: ajustes_devolucao; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: creditos_fiscais; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: empresas; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.empresas VALUES (3, 'CM', 'CM Comercial Artigos Promocionais Ltda', 0.000000, 0.000000, true, '2026-03-15 14:20:08.63862');
INSERT INTO public.empresas VALUES (1, 'SIX', 'SIX Comercial Artigos Promocionais Ltda', 0.088324, 0.029614, true, '2026-03-15 14:20:08.63862');
INSERT INTO public.empresas VALUES (2, 'ENOVA', 'ENOVA Comercial Artigos Promocionais Ltda', 0.093254, 0.031256, true, '2026-03-15 14:20:08.63862');


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuarios VALUES (2, 'Miriam', 'miriam@enovaonline.com.br', '$2b$12$b.bXQji.ugJNq/fmfnQye.Ozwh34UZslHqj7s8T81UVmSWv/HDgIu', 'Leitura', true, '2026-03-16 21:14:32.494988');
INSERT INTO public.usuarios VALUES (1, 'Administrador', 'cleiber@enovaonline.com.br', '$2b$12$lbFs0NICI6wnNW5ZcbRgUuP5w7cvQf7MXPh1UtjND/8cTTB93NI7G', 'Admin', true, '2026-03-15 14:20:08.63862');
INSERT INTO public.usuarios VALUES (3, 'Rafael', 'rafael@enovaonline.com.br', '$2b$12$9Z8ZJ3BB/mNcEmG9L84AtepSYKFs7mWGAVhDgsaLxKcBJsMcHNqXu', 'Fiscal', true, '2026-05-15 18:16:06.834851');


--
-- Data for Name: das_pagamentos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.das_pagamentos VALUES (1, 1, 2023, 3, 9573.40, '2026-03-16 15:59:37.075967', NULL);
INSERT INTO public.das_pagamentos VALUES (2, 1, 2023, 4, 13048.86, '2026-03-16 15:59:37.087893', NULL);
INSERT INTO public.das_pagamentos VALUES (3, 1, 2023, 5, 42626.53, '2026-03-16 15:59:37.089006', NULL);
INSERT INTO public.das_pagamentos VALUES (4, 1, 2023, 6, 29457.25, '2026-03-16 15:59:37.090767', NULL);
INSERT INTO public.das_pagamentos VALUES (5, 1, 2023, 7, 27385.05, '2026-03-16 15:59:37.092003', NULL);
INSERT INTO public.das_pagamentos VALUES (6, 1, 2023, 8, 28063.84, '2026-03-16 15:59:37.092863', NULL);
INSERT INTO public.das_pagamentos VALUES (7, 1, 2023, 9, 28377.84, '2026-03-16 15:59:37.09384', NULL);
INSERT INTO public.das_pagamentos VALUES (8, 1, 2023, 10, 53197.38, '2026-03-16 15:59:37.095089', NULL);
INSERT INTO public.das_pagamentos VALUES (9, 1, 2023, 11, 10891.03, '2026-03-16 15:59:37.09602', NULL);
INSERT INTO public.das_pagamentos VALUES (10, 1, 2023, 12, 30656.32, '2026-03-16 15:59:37.096914', NULL);
INSERT INTO public.das_pagamentos VALUES (11, 1, 2024, 1, 22290.25, '2026-03-16 15:59:37.097794', NULL);
INSERT INTO public.das_pagamentos VALUES (12, 1, 2024, 2, 13341.04, '2026-03-16 15:59:37.098704', NULL);
INSERT INTO public.das_pagamentos VALUES (13, 1, 2024, 3, 8710.39, '2026-03-16 15:59:37.099588', NULL);
INSERT INTO public.das_pagamentos VALUES (14, 1, 2024, 4, 7918.57, '2026-03-16 15:59:37.100596', NULL);
INSERT INTO public.das_pagamentos VALUES (15, 1, 2024, 5, 16731.48, '2026-03-16 15:59:37.101504', NULL);
INSERT INTO public.das_pagamentos VALUES (16, 1, 2024, 6, 11879.15, '2026-03-16 15:59:37.102534', NULL);
INSERT INTO public.das_pagamentos VALUES (17, 1, 2024, 7, 498.75, '2026-03-16 15:59:37.103534', NULL);
INSERT INTO public.das_pagamentos VALUES (18, 1, 2024, 8, 8961.07, '2026-03-16 15:59:37.104442', NULL);
INSERT INTO public.das_pagamentos VALUES (19, 1, 2024, 9, 6623.46, '2026-03-16 15:59:37.105313', NULL);
INSERT INTO public.das_pagamentos VALUES (20, 1, 2024, 10, 7105.63, '2026-03-16 15:59:37.106145', NULL);
INSERT INTO public.das_pagamentos VALUES (21, 1, 2024, 11, 12250.23, '2026-03-16 15:59:37.107549', NULL);
INSERT INTO public.das_pagamentos VALUES (22, 1, 2024, 12, 3433.25, '2026-03-16 15:59:37.108842', NULL);
INSERT INTO public.das_pagamentos VALUES (23, 1, 2025, 1, 2465.48, '2026-03-16 15:59:37.109868', NULL);
INSERT INTO public.das_pagamentos VALUES (24, 1, 2025, 2, 5916.35, '2026-03-16 15:59:37.111292', NULL);
INSERT INTO public.das_pagamentos VALUES (25, 1, 2025, 3, 1593.14, '2026-03-16 15:59:37.112272', NULL);
INSERT INTO public.das_pagamentos VALUES (26, 1, 2025, 4, 10806.38, '2026-03-16 15:59:37.113163', NULL);
INSERT INTO public.das_pagamentos VALUES (27, 1, 2025, 5, 13848.73, '2026-03-16 15:59:37.114063', NULL);
INSERT INTO public.das_pagamentos VALUES (28, 1, 2025, 6, 6994.59, '2026-03-16 15:59:37.114963', NULL);
INSERT INTO public.das_pagamentos VALUES (29, 1, 2025, 7, 3859.22, '2026-03-16 15:59:37.116014', NULL);
INSERT INTO public.das_pagamentos VALUES (30, 1, 2025, 8, 6842.74, '2026-03-16 15:59:37.117081', NULL);
INSERT INTO public.das_pagamentos VALUES (31, 1, 2025, 9, 34851.24, '2026-03-16 15:59:37.118015', NULL);
INSERT INTO public.das_pagamentos VALUES (32, 1, 2025, 10, 5655.18, '2026-03-16 15:59:37.120399', NULL);
INSERT INTO public.das_pagamentos VALUES (33, 1, 2025, 11, 8690.85, '2026-03-16 15:59:37.12118', NULL);
INSERT INTO public.das_pagamentos VALUES (34, 1, 2025, 12, 5986.03, '2026-03-16 15:59:37.121917', NULL);
INSERT INTO public.das_pagamentos VALUES (35, 2, 2024, 9, 6388.22, '2026-03-16 15:59:37.122639', NULL);
INSERT INTO public.das_pagamentos VALUES (36, 2, 2024, 10, 12192.80, '2026-03-16 15:59:37.123751', NULL);
INSERT INTO public.das_pagamentos VALUES (37, 2, 2024, 11, 20041.66, '2026-03-16 15:59:37.126207', NULL);
INSERT INTO public.das_pagamentos VALUES (38, 2, 2024, 12, 17328.49, '2026-03-16 15:59:37.12704', NULL);
INSERT INTO public.das_pagamentos VALUES (39, 2, 2025, 1, 3364.75, '2026-03-16 15:59:37.127853', NULL);
INSERT INTO public.das_pagamentos VALUES (40, 2, 2025, 2, 16027.14, '2026-03-16 15:59:37.128637', NULL);
INSERT INTO public.das_pagamentos VALUES (41, 2, 2025, 3, 3293.34, '2026-03-16 15:59:37.12938', NULL);
INSERT INTO public.das_pagamentos VALUES (42, 2, 2025, 4, 10404.74, '2026-03-16 15:59:37.130134', NULL);
INSERT INTO public.das_pagamentos VALUES (43, 2, 2025, 5, 14009.48, '2026-03-16 15:59:37.130878', NULL);
INSERT INTO public.das_pagamentos VALUES (44, 2, 2025, 6, 16712.31, '2026-03-16 15:59:37.131636', NULL);
INSERT INTO public.das_pagamentos VALUES (45, 2, 2025, 7, 12453.79, '2026-03-16 15:59:37.132439', NULL);
INSERT INTO public.das_pagamentos VALUES (46, 2, 2025, 8, 19886.90, '2026-03-16 15:59:37.133271', NULL);
INSERT INTO public.das_pagamentos VALUES (47, 2, 2025, 9, 21365.69, '2026-03-16 15:59:37.134383', NULL);
INSERT INTO public.das_pagamentos VALUES (48, 2, 2025, 10, 16902.84, '2026-03-16 15:59:37.135507', NULL);
INSERT INTO public.das_pagamentos VALUES (49, 2, 2025, 11, 14635.59, '2026-03-16 15:59:37.136402', NULL);
INSERT INTO public.das_pagamentos VALUES (50, 2, 2025, 12, 9316.61, '2026-03-16 15:59:37.137308', NULL);
INSERT INTO public.das_pagamentos VALUES (101, 3, 2016, 10, 4855.77, '2026-03-17 11:10:03.469205', NULL);
INSERT INTO public.das_pagamentos VALUES (102, 3, 2016, 11, 9748.30, '2026-03-17 11:10:03.583849', NULL);
INSERT INTO public.das_pagamentos VALUES (103, 3, 2016, 12, 1592.63, '2026-03-17 11:10:03.630439', NULL);
INSERT INTO public.das_pagamentos VALUES (104, 3, 2017, 4, 1068.63, '2026-03-17 11:10:03.677078', NULL);
INSERT INTO public.das_pagamentos VALUES (105, 3, 2017, 5, 267.87, '2026-03-17 11:10:03.719707', NULL);
INSERT INTO public.das_pagamentos VALUES (106, 3, 2017, 6, 1301.13, '2026-03-17 11:10:03.766285', NULL);
INSERT INTO public.das_pagamentos VALUES (107, 3, 2017, 7, 4117.13, '2026-03-17 11:10:03.801626', NULL);
INSERT INTO public.das_pagamentos VALUES (108, 3, 2017, 8, 3259.58, '2026-03-17 11:10:03.841028', NULL);
INSERT INTO public.das_pagamentos VALUES (109, 3, 2017, 9, 4978.67, '2026-03-17 11:10:03.884295', NULL);
INSERT INTO public.das_pagamentos VALUES (110, 3, 2017, 10, 796.80, '2026-03-17 11:10:03.921022', NULL);
INSERT INTO public.das_pagamentos VALUES (111, 3, 2017, 11, 469.71, '2026-03-17 11:10:03.94662', NULL);
INSERT INTO public.das_pagamentos VALUES (112, 3, 2017, 12, 5386.04, '2026-03-17 11:10:03.983161', NULL);
INSERT INTO public.das_pagamentos VALUES (113, 3, 2018, 3, 894.69, '2026-03-17 11:10:04.020853', NULL);
INSERT INTO public.das_pagamentos VALUES (114, 3, 2018, 4, 2213.44, '2026-03-17 11:10:04.061751', NULL);
INSERT INTO public.das_pagamentos VALUES (115, 3, 2018, 5, 5268.13, '2026-03-17 11:10:04.090332', NULL);
INSERT INTO public.das_pagamentos VALUES (116, 3, 2018, 6, 6716.03, '2026-03-17 11:10:04.119804', NULL);
INSERT INTO public.das_pagamentos VALUES (117, 3, 2018, 7, 9487.68, '2026-03-17 11:10:04.149054', NULL);
INSERT INTO public.das_pagamentos VALUES (118, 3, 2018, 8, 4595.36, '2026-03-17 11:10:04.179037', NULL);
INSERT INTO public.das_pagamentos VALUES (119, 3, 2018, 9, 10301.49, '2026-03-17 11:10:04.207182', NULL);
INSERT INTO public.das_pagamentos VALUES (120, 3, 2018, 10, 1770.98, '2026-03-17 11:10:04.232782', NULL);
INSERT INTO public.das_pagamentos VALUES (121, 3, 2018, 11, 9224.37, '2026-03-17 11:10:04.259765', NULL);
INSERT INTO public.das_pagamentos VALUES (122, 3, 2018, 12, 7505.60, '2026-03-17 11:10:04.293228', NULL);
INSERT INTO public.das_pagamentos VALUES (123, 3, 2019, 1, 1932.36, '2026-03-17 11:10:04.323078', NULL);
INSERT INTO public.das_pagamentos VALUES (124, 3, 2019, 2, 227.91, '2026-03-17 11:10:04.362629', NULL);
INSERT INTO public.das_pagamentos VALUES (125, 3, 2019, 3, 3599.71, '2026-03-17 11:10:04.400245', NULL);
INSERT INTO public.das_pagamentos VALUES (126, 3, 2019, 4, 4395.39, '2026-03-17 11:10:04.445591', NULL);
INSERT INTO public.das_pagamentos VALUES (127, 3, 2019, 5, 9963.46, '2026-03-17 11:10:04.496175', NULL);
INSERT INTO public.das_pagamentos VALUES (128, 3, 2019, 6, 92.87, '2026-03-17 11:10:04.54047', NULL);
INSERT INTO public.das_pagamentos VALUES (129, 3, 2019, 7, 28122.65, '2026-03-17 11:10:04.584301', NULL);
INSERT INTO public.das_pagamentos VALUES (130, 3, 2019, 8, 8249.48, '2026-03-17 11:10:04.63048', NULL);
INSERT INTO public.das_pagamentos VALUES (131, 3, 2019, 9, 1965.94, '2026-03-17 11:10:04.677027', NULL);
INSERT INTO public.das_pagamentos VALUES (132, 3, 2019, 10, 2821.74, '2026-03-17 11:10:04.716833', NULL);
INSERT INTO public.das_pagamentos VALUES (133, 3, 2019, 11, 14276.10, '2026-03-17 11:10:04.757788', NULL);
INSERT INTO public.das_pagamentos VALUES (134, 3, 2019, 12, 24625.54, '2026-03-17 11:10:04.798011', NULL);
INSERT INTO public.das_pagamentos VALUES (135, 3, 2020, 1, 3300.07, '2026-03-17 11:10:04.83825', NULL);
INSERT INTO public.das_pagamentos VALUES (136, 3, 2020, 2, 4448.54, '2026-03-17 11:10:04.874306', NULL);
INSERT INTO public.das_pagamentos VALUES (137, 3, 2020, 3, 11131.07, '2026-03-17 11:10:04.914057', NULL);
INSERT INTO public.das_pagamentos VALUES (138, 3, 2020, 4, 5108.27, '2026-03-17 11:10:04.952244', NULL);
INSERT INTO public.das_pagamentos VALUES (139, 3, 2020, 5, 1355.92, '2026-03-17 11:10:04.993362', NULL);
INSERT INTO public.das_pagamentos VALUES (140, 3, 2020, 6, 2316.16, '2026-03-17 11:10:05.026586', NULL);
INSERT INTO public.das_pagamentos VALUES (141, 3, 2020, 8, 1887.44, '2026-03-17 11:10:05.061809', NULL);
INSERT INTO public.das_pagamentos VALUES (142, 3, 2020, 9, 5575.41, '2026-03-17 11:10:05.09704', NULL);
INSERT INTO public.das_pagamentos VALUES (143, 3, 2020, 10, 8969.20, '2026-03-17 11:10:05.136665', NULL);
INSERT INTO public.das_pagamentos VALUES (144, 3, 2020, 11, 11530.79, '2026-03-17 11:10:05.175031', NULL);
INSERT INTO public.das_pagamentos VALUES (145, 3, 2020, 12, 6739.36, '2026-03-17 11:10:05.212059', NULL);
INSERT INTO public.das_pagamentos VALUES (146, 3, 2021, 1, 678.55, '2026-03-17 11:10:05.247835', NULL);
INSERT INTO public.das_pagamentos VALUES (147, 3, 2021, 2, 1035.75, '2026-03-17 11:10:05.281193', NULL);
INSERT INTO public.das_pagamentos VALUES (148, 3, 2021, 3, 331.24, '2026-03-17 11:10:05.320196', NULL);
INSERT INTO public.das_pagamentos VALUES (149, 3, 2021, 4, 5026.38, '2026-03-17 11:10:05.358393', NULL);
INSERT INTO public.das_pagamentos VALUES (150, 3, 2021, 6, 4068.25, '2026-03-17 11:10:05.395712', NULL);
INSERT INTO public.das_pagamentos VALUES (151, 3, 2021, 7, 9901.18, '2026-03-17 11:10:05.431736', NULL);
INSERT INTO public.das_pagamentos VALUES (152, 3, 2021, 8, 4737.67, '2026-03-17 11:10:05.469883', NULL);
INSERT INTO public.das_pagamentos VALUES (153, 3, 2021, 9, 6037.74, '2026-03-17 11:10:05.508347', NULL);
INSERT INTO public.das_pagamentos VALUES (154, 3, 2021, 10, 11141.08, '2026-03-17 11:10:05.544864', NULL);
INSERT INTO public.das_pagamentos VALUES (155, 3, 2021, 11, 13013.93, '2026-03-17 11:10:05.574134', NULL);
INSERT INTO public.das_pagamentos VALUES (156, 3, 2021, 12, 34650.62, '2026-03-17 11:10:05.607814', NULL);
INSERT INTO public.das_pagamentos VALUES (157, 3, 2022, 1, 1736.00, '2026-03-17 11:10:05.64361', NULL);
INSERT INTO public.das_pagamentos VALUES (158, 3, 2022, 2, 1255.90, '2026-03-17 11:10:05.678514', NULL);
INSERT INTO public.das_pagamentos VALUES (159, 3, 2022, 3, 2024.60, '2026-03-17 11:10:05.714805', NULL);
INSERT INTO public.das_pagamentos VALUES (160, 3, 2022, 6, 1172.00, '2026-03-17 11:10:05.75556', NULL);
INSERT INTO public.das_pagamentos VALUES (161, 3, 2022, 8, 1396.65, '2026-03-17 11:10:05.793967', NULL);
INSERT INTO public.das_pagamentos VALUES (162, 3, 2022, 9, 7574.62, '2026-03-17 11:10:05.838106', NULL);
INSERT INTO public.das_pagamentos VALUES (163, 3, 2022, 10, 3357.84, '2026-03-17 11:10:05.875635', NULL);
INSERT INTO public.das_pagamentos VALUES (164, 3, 2023, 10, 5353.30, '2026-03-17 11:10:05.913823', NULL);
INSERT INTO public.das_pagamentos VALUES (165, 3, 2023, 11, 4044.96, '2026-03-17 11:10:05.956296', NULL);
INSERT INTO public.das_pagamentos VALUES (166, 3, 2023, 12, 4303.36, '2026-03-17 11:10:05.993059', NULL);
INSERT INTO public.das_pagamentos VALUES (167, 3, 2024, 2, 3283.21, '2026-03-17 11:10:06.030467', NULL);
INSERT INTO public.das_pagamentos VALUES (168, 3, 2024, 3, 3943.48, '2026-03-17 11:10:06.067034', NULL);
INSERT INTO public.das_pagamentos VALUES (169, 3, 2024, 4, 10379.48, '2026-03-17 11:10:06.104755', NULL);
INSERT INTO public.das_pagamentos VALUES (170, 3, 2024, 5, 12874.53, '2026-03-17 11:10:06.138854', NULL);
INSERT INTO public.das_pagamentos VALUES (171, 3, 2024, 6, 5002.17, '2026-03-17 11:10:06.175495', NULL);
INSERT INTO public.das_pagamentos VALUES (172, 3, 2024, 7, 9036.65, '2026-03-17 11:10:06.208153', NULL);
INSERT INTO public.das_pagamentos VALUES (173, 3, 2024, 8, 1339.55, '2026-03-17 11:10:06.237967', NULL);
INSERT INTO public.das_pagamentos VALUES (174, 3, 2024, 9, 3925.77, '2026-03-17 11:10:06.27037', NULL);
INSERT INTO public.das_pagamentos VALUES (175, 3, 2024, 10, 5256.76, '2026-03-17 11:10:06.309281', NULL);
INSERT INTO public.das_pagamentos VALUES (176, 3, 2024, 11, 4375.39, '2026-03-17 11:10:06.346673', NULL);
INSERT INTO public.das_pagamentos VALUES (177, 3, 2024, 12, 2628.43, '2026-03-17 11:10:06.386837', NULL);
INSERT INTO public.das_pagamentos VALUES (178, 3, 2025, 1, 1608.77, '2026-03-17 11:10:06.426082', NULL);
INSERT INTO public.das_pagamentos VALUES (179, 1, 2026, 1, 5725.70, '2026-05-04 15:51:39.612147', NULL);
INSERT INTO public.das_pagamentos VALUES (180, 1, 2026, 2, 1066.86, '2026-05-04 15:51:39.612147', NULL);
INSERT INTO public.das_pagamentos VALUES (181, 1, 2026, 3, 614.51, '2026-05-04 15:51:39.612147', NULL);
INSERT INTO public.das_pagamentos VALUES (182, 1, 2026, 4, 1946.71, '2026-05-04 15:51:39.612147', NULL);
INSERT INTO public.das_pagamentos VALUES (183, 2, 2026, 1, 9221.83, '2026-05-04 15:51:39.630055', NULL);
INSERT INTO public.das_pagamentos VALUES (184, 2, 2026, 2, 4187.16, '2026-05-04 15:51:39.630055', NULL);
INSERT INTO public.das_pagamentos VALUES (185, 2, 2026, 3, 6067.98, '2026-05-04 15:51:39.630055', NULL);
INSERT INTO public.das_pagamentos VALUES (186, 2, 2026, 4, 5990.24, '2026-05-04 15:51:39.630055', NULL);
INSERT INTO public.das_pagamentos VALUES (187, 1, 2021, 1, 1883.47, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (188, 1, 2022, 3, 1336.33, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (189, 1, 2022, 4, 1144.90, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (190, 1, 2022, 5, 2284.70, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (191, 1, 2022, 6, 6490.94, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (192, 1, 2022, 7, 14015.05, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (193, 1, 2022, 8, 8424.60, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (194, 1, 2022, 9, 11554.60, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (195, 1, 2022, 10, 15957.62, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (196, 1, 2022, 11, 23947.00, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (197, 1, 2022, 12, 19870.00, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (198, 1, 2023, 1, 31767.85, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (199, 1, 2023, 2, 12285.85, '2026-05-15 13:41:41.262173', NULL);
INSERT INTO public.das_pagamentos VALUES (200, 2, 2024, 8, 2447.92, '2026-05-15 13:47:03.038915', NULL);
INSERT INTO public.das_pagamentos VALUES (203, 1, 2026, 5, 86.28, '2026-05-25 15:01:13.499513', NULL);
INSERT INTO public.das_pagamentos VALUES (205, 2, 2026, 5, 11343.48, '2026-05-28 14:39:28.262482', NULL);


--
-- Data for Name: encargos_horas_extras; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.encargos_horas_extras VALUES (1, 1, 2026, 4, 0, '2026-05-18 17:06:49.836768');


--
-- Data for Name: feriados; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.feriados VALUES (1, 1, 1, 'Ano Novo', 'nacional', true);
INSERT INTO public.feriados VALUES (6, 25, 1, 'Aniversário de São Paulo', 'estadual', true);
INSERT INTO public.feriados VALUES (7, 19, 2, 'Aniversário de Osasco', 'municipal', true);
INSERT INTO public.feriados VALUES (8, 18, 4, 'Sexta feira Santa', 'nacional', true);
INSERT INTO public.feriados VALUES (10, 13, 6, 'Padroeiro de Osasco', 'municipal', true);
INSERT INTO public.feriados VALUES (12, 9, 7, 'Data Magna de São Paulo', 'nacional', true);
INSERT INTO public.feriados VALUES (13, 7, 9, 'Independência', 'nacional', true);
INSERT INTO public.feriados VALUES (14, 12, 10, 'Nossa Senhora Aparecida', 'nacional', true);
INSERT INTO public.feriados VALUES (15, 2, 11, 'Finados', 'nacional', true);
INSERT INTO public.feriados VALUES (16, 15, 11, 'Proclamação da República', 'nacional', true);
INSERT INTO public.feriados VALUES (17, 20, 11, 'Consciência Negra', 'nacional', true);
INSERT INTO public.feriados VALUES (18, 25, 12, 'Natal', 'nacional', true);
INSERT INTO public.feriados VALUES (11, 19, 6, 'Corpus Christi', 'nacional', false);
INSERT INTO public.feriados VALUES (19, 4, 6, 'Corpus Christi', 'nacional', true);
INSERT INTO public.feriados VALUES (20, 3, 4, 'Paixão de Cristo', 'nacional', true);
INSERT INTO public.feriados VALUES (21, 21, 4, 'Tiradentes', 'nacional', true);
INSERT INTO public.feriados VALUES (9, 1, 5, 'Dia do Trabalhador', 'nacional', false);


--
-- Data for Name: funcionarios; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.funcionarios VALUES (1, 2, 'Gabriel Schiochet Lima', 'Enc. de Exp.', 3500, 250, false, 562, true, '2026-05-18 16:33:56.571351', 0, 0);
INSERT INTO public.funcionarios VALUES (2, 2, 'Henrique Fernandes Lima', 'Ajud. Geral I', 2500, 250, true, 0, true, '2026-05-18 16:33:56.571351', 12.2, 0);


--
-- Data for Name: historico_faturamento; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.historico_faturamento VALUES (1, 1, 2020, 12, 41855.00, NULL, '2026-03-16 15:59:36.693127');
INSERT INTO public.historico_faturamento VALUES (48, 1, 2025, 12, 61383.71, NULL, '2026-03-16 15:59:36.809072');
INSERT INTO public.historico_faturamento VALUES (85, 2, 2025, 9, 217130.95, NULL, '2026-03-16 15:59:37.070515');
INSERT INTO public.historico_faturamento VALUES (78, 2, 2025, 2, 36900.00, NULL, '2026-03-16 15:59:37.06365');
INSERT INTO public.historico_faturamento VALUES (260, 2, 2026, 3, 110536.47, NULL, '2026-04-07 15:30:41.882694');
INSERT INTO public.historico_faturamento VALUES (262, 2, 2026, 4, 91855.40, NULL, '2026-05-04 10:51:39.021588');
INSERT INTO public.historico_faturamento VALUES (282, 3, 2016, 8, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (283, 3, 2016, 9, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (181, 3, 2016, 10, 107906.00, NULL, '2026-03-16 18:48:24.851951');
INSERT INTO public.historico_faturamento VALUES (182, 3, 2016, 11, 171625.00, NULL, '2026-03-16 18:48:24.930524');
INSERT INTO public.historico_faturamento VALUES (183, 3, 2016, 12, 27178.00, NULL, '2026-03-16 18:48:24.963933');
INSERT INTO public.historico_faturamento VALUES (263, 1, 2021, 1, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (264, 1, 2021, 2, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (265, 1, 2021, 3, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (266, 1, 2021, 4, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (267, 1, 2021, 5, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (268, 1, 2021, 6, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (269, 1, 2021, 7, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (270, 1, 2021, 8, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (271, 1, 2021, 9, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (272, 1, 2021, 10, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (273, 1, 2021, 11, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (274, 1, 2021, 12, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (275, 1, 2022, 1, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (2, 1, 2022, 2, 29696.20, NULL, '2026-03-16 15:59:36.759004');
INSERT INTO public.historico_faturamento VALUES (3, 1, 2022, 3, 25442.20, NULL, '2026-03-16 15:59:36.760455');
INSERT INTO public.historico_faturamento VALUES (4, 1, 2022, 4, 50771.00, NULL, '2026-03-16 15:59:36.761521');
INSERT INTO public.historico_faturamento VALUES (5, 1, 2022, 5, 124347.55, NULL, '2026-03-16 15:59:36.762651');
INSERT INTO public.historico_faturamento VALUES (6, 1, 2022, 6, 205499.20, NULL, '2026-03-16 15:59:36.763761');
INSERT INTO public.historico_faturamento VALUES (7, 1, 2022, 7, 112057.79, NULL, '2026-03-16 15:59:36.764846');
INSERT INTO public.historico_faturamento VALUES (8, 1, 2022, 8, 144432.50, NULL, '2026-03-16 15:59:36.76599');
INSERT INTO public.historico_faturamento VALUES (9, 1, 2022, 9, 184908.70, NULL, '2026-03-16 15:59:36.767102');
INSERT INTO public.historico_faturamento VALUES (10, 1, 2022, 10, 259728.85, NULL, '2026-03-16 15:59:36.768029');
INSERT INTO public.historico_faturamento VALUES (11, 1, 2022, 11, 208499.86, NULL, '2026-03-16 15:59:36.769481');
INSERT INTO public.historico_faturamento VALUES (12, 1, 2022, 12, 322516.28, NULL, '2026-03-16 15:59:36.770865');
INSERT INTO public.historico_faturamento VALUES (13, 1, 2023, 1, 123600.16, NULL, '2026-03-16 15:59:36.772296');
INSERT INTO public.historico_faturamento VALUES (14, 1, 2023, 2, 96272.40, NULL, '2026-03-16 15:59:36.773889');
INSERT INTO public.historico_faturamento VALUES (15, 1, 2023, 3, 129338.60, NULL, '2026-03-16 15:59:36.774936');
INSERT INTO public.historico_faturamento VALUES (16, 1, 2023, 4, 412163.50, NULL, '2026-03-16 15:59:36.776025');
INSERT INTO public.historico_faturamento VALUES (17, 1, 2023, 5, 267307.25, NULL, '2026-03-16 15:59:36.777102');
INSERT INTO public.historico_faturamento VALUES (18, 1, 2023, 6, 243784.30, NULL, '2026-03-16 15:59:36.777927');
INSERT INTO public.historico_faturamento VALUES (19, 1, 2023, 7, 248654.10, NULL, '2026-03-16 15:59:36.778757');
INSERT INTO public.historico_faturamento VALUES (20, 1, 2023, 8, 247563.80, NULL, '2026-03-16 15:59:36.77984');
INSERT INTO public.historico_faturamento VALUES (21, 1, 2023, 9, 459263.10, NULL, '2026-03-16 15:59:36.78087');
INSERT INTO public.historico_faturamento VALUES (22, 1, 2023, 10, 91819.30, NULL, '2026-03-16 15:59:36.781901');
INSERT INTO public.historico_faturamento VALUES (23, 1, 2023, 11, 262035.50, NULL, '2026-03-16 15:59:36.782969');
INSERT INTO public.historico_faturamento VALUES (24, 1, 2023, 12, 189605.65, NULL, '2026-03-16 15:59:36.783914');
INSERT INTO public.historico_faturamento VALUES (25, 1, 2024, 1, 114904.20, NULL, '2026-03-16 15:59:36.78477');
INSERT INTO public.historico_faturamento VALUES (26, 1, 2024, 2, 75093.47, NULL, '2026-03-16 15:59:36.785747');
INSERT INTO public.historico_faturamento VALUES (27, 1, 2024, 3, 68394.80, NULL, '2026-03-16 15:59:36.786785');
INSERT INTO public.historico_faturamento VALUES (28, 1, 2024, 4, 145417.59, NULL, '2026-03-16 15:59:36.787615');
INSERT INTO public.historico_faturamento VALUES (29, 1, 2024, 5, 106506.21, NULL, '2026-03-16 15:59:36.788464');
INSERT INTO public.historico_faturamento VALUES (30, 1, 2024, 6, 4592.73, NULL, '2026-03-16 15:59:36.789491');
INSERT INTO public.historico_faturamento VALUES (31, 1, 2024, 7, 85715.78, NULL, '2026-03-16 15:59:36.791508');
INSERT INTO public.historico_faturamento VALUES (32, 1, 2024, 8, 65704.82, NULL, '2026-03-16 15:59:36.792825');
INSERT INTO public.historico_faturamento VALUES (33, 1, 2024, 9, 72124.20, NULL, '2026-03-16 15:59:36.793824');
INSERT INTO public.historico_faturamento VALUES (34, 1, 2024, 10, 129703.30, NULL, '2026-03-16 15:59:36.795377');
INSERT INTO public.historico_faturamento VALUES (35, 1, 2024, 11, 36157.90, NULL, '2026-03-16 15:59:36.796459');
INSERT INTO public.historico_faturamento VALUES (36, 1, 2024, 12, 31257.28, NULL, '2026-03-16 15:59:36.797507');
INSERT INTO public.historico_faturamento VALUES (37, 1, 2025, 1, 67353.80, NULL, '2026-03-16 15:59:36.79856');
INSERT INTO public.historico_faturamento VALUES (38, 1, 2025, 2, 18409.29, NULL, '2026-03-16 15:59:36.799648');
INSERT INTO public.historico_faturamento VALUES (39, 1, 2025, 3, 128725.10, NULL, '2026-03-16 15:59:36.800675');
INSERT INTO public.historico_faturamento VALUES (40, 1, 2025, 4, 160273.10, NULL, '2026-03-16 15:59:36.801542');
INSERT INTO public.historico_faturamento VALUES (41, 1, 2025, 5, 75561.90, NULL, '2026-03-16 15:59:36.802324');
INSERT INTO public.historico_faturamento VALUES (42, 1, 2025, 6, 44105.40, NULL, '2026-03-16 15:59:36.803121');
INSERT INTO public.historico_faturamento VALUES (43, 1, 2025, 7, 78381.90, NULL, '2026-03-16 15:59:36.80395');
INSERT INTO public.historico_faturamento VALUES (44, 1, 2025, 8, 81396.00, NULL, '2026-03-16 15:59:36.804756');
INSERT INTO public.historico_faturamento VALUES (45, 1, 2025, 9, 371944.90, NULL, '2026-03-16 15:59:36.805582');
INSERT INTO public.historico_faturamento VALUES (46, 1, 2025, 10, 61071.06, NULL, '2026-03-16 15:59:36.806782');
INSERT INTO public.historico_faturamento VALUES (47, 1, 2025, 11, 92950.22, NULL, '2026-03-16 15:59:36.808149');
INSERT INTO public.historico_faturamento VALUES (49, 1, 2026, 1, 30984.30, NULL, '2026-03-16 15:59:36.810074');
INSERT INTO public.historico_faturamento VALUES (50, 1, 2026, 2, 15691.00, NULL, '2026-03-16 15:59:36.811142');
INSERT INTO public.historico_faturamento VALUES (259, 1, 2026, 3, 17367.00, NULL, '2026-04-06 10:34:24.444747');
INSERT INTO public.historico_faturamento VALUES (261, 1, 2026, 4, 109280.30, NULL, '2026-05-04 10:51:10.157212');
INSERT INTO public.historico_faturamento VALUES (276, 2, 2024, 1, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (277, 2, 2024, 2, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (278, 2, 2024, 3, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (279, 2, 2024, 4, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (280, 2, 2024, 5, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (281, 2, 2024, 6, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (71, 2, 2024, 7, 54398.20, NULL, '2026-03-16 15:59:37.054214');
INSERT INTO public.historico_faturamento VALUES (72, 2, 2024, 8, 145992.00, NULL, '2026-03-16 15:59:37.056835');
INSERT INTO public.historico_faturamento VALUES (73, 2, 2024, 9, 271008.70, NULL, '2026-03-16 15:59:37.059622');
INSERT INTO public.historico_faturamento VALUES (74, 2, 2024, 10, 107831.50, NULL, '2026-03-16 15:59:37.060544');
INSERT INTO public.historico_faturamento VALUES (75, 2, 2024, 11, 236133.74, NULL, '2026-03-16 15:59:37.061319');
INSERT INTO public.historico_faturamento VALUES (76, 2, 2024, 12, 88945.04, NULL, '2026-03-16 15:59:37.062134');
INSERT INTO public.historico_faturamento VALUES (77, 2, 2025, 1, 131772.55, NULL, '2026-03-16 15:59:37.062933');
INSERT INTO public.historico_faturamento VALUES (79, 2, 2025, 3, 117489.80, NULL, '2026-03-16 15:59:37.064884');
INSERT INTO public.historico_faturamento VALUES (80, 2, 2025, 4, 153541.50, NULL, '2026-03-16 15:59:37.065823');
INSERT INTO public.historico_faturamento VALUES (81, 2, 2025, 5, 171937.30, NULL, '2026-03-16 15:59:37.06663');
INSERT INTO public.historico_faturamento VALUES (82, 2, 2025, 6, 126562.90, NULL, '2026-03-16 15:59:37.068261');
INSERT INTO public.historico_faturamento VALUES (83, 2, 2025, 7, 199868.36, NULL, '2026-03-16 15:59:37.06905');
INSERT INTO public.historico_faturamento VALUES (84, 2, 2025, 8, 59340.20, NULL, '2026-03-16 15:59:37.069779');
INSERT INTO public.historico_faturamento VALUES (86, 2, 2025, 10, 170908.44, NULL, '2026-03-16 15:59:37.07123');
INSERT INTO public.historico_faturamento VALUES (87, 2, 2025, 11, 149038.55, NULL, '2026-03-16 15:59:37.072245');
INSERT INTO public.historico_faturamento VALUES (88, 2, 2025, 12, 94873.80, NULL, '2026-03-16 15:59:37.073026');
INSERT INTO public.historico_faturamento VALUES (89, 2, 2026, 1, 128151.80, NULL, '2026-03-16 15:59:37.073836');
INSERT INTO public.historico_faturamento VALUES (90, 2, 2026, 2, 48021.25, NULL, '2026-03-16 15:59:37.074927');
INSERT INTO public.historico_faturamento VALUES (284, 3, 2017, 1, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (285, 3, 2017, 2, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (286, 3, 2017, 3, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (184, 3, 2017, 4, 17900.00, NULL, '2026-03-16 18:48:24.999557');
INSERT INTO public.historico_faturamento VALUES (185, 3, 2017, 5, 4472.00, NULL, '2026-03-16 18:48:25.036018');
INSERT INTO public.historico_faturamento VALUES (186, 3, 2017, 6, 21330.00, NULL, '2026-03-16 18:48:25.07762');
INSERT INTO public.historico_faturamento VALUES (187, 3, 2017, 7, 62005.00, NULL, '2026-03-16 18:48:25.111988');
INSERT INTO public.historico_faturamento VALUES (188, 3, 2017, 8, 49090.00, NULL, '2026-03-16 18:48:25.146924');
INSERT INTO public.historico_faturamento VALUES (189, 3, 2017, 9, 74980.00, NULL, '2026-03-16 18:48:25.182837');
INSERT INTO public.historico_faturamento VALUES (190, 3, 2017, 10, 12000.00, NULL, '2026-03-16 18:48:25.218523');
INSERT INTO public.historico_faturamento VALUES (191, 3, 2017, 11, 7074.00, NULL, '2026-03-16 18:48:25.261263');
INSERT INTO public.historico_faturamento VALUES (192, 3, 2017, 12, 81115.00, NULL, '2026-03-16 18:48:25.297242');
INSERT INTO public.historico_faturamento VALUES (287, 3, 2018, 1, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (288, 3, 2018, 2, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (193, 3, 2018, 3, 16630.00, NULL, '2026-03-16 18:48:25.332918');
INSERT INTO public.historico_faturamento VALUES (194, 3, 2018, 4, 38764.20, NULL, '2026-03-16 18:48:25.3642');
INSERT INTO public.historico_faturamento VALUES (195, 3, 2018, 5, 84425.19, NULL, '2026-03-16 18:48:25.396597');
INSERT INTO public.historico_faturamento VALUES (196, 3, 2018, 6, 95670.00, NULL, '2026-03-16 18:48:25.429775');
INSERT INTO public.historico_faturamento VALUES (197, 3, 2018, 7, 124022.00, NULL, '2026-03-16 18:48:25.462636');
INSERT INTO public.historico_faturamento VALUES (198, 3, 2018, 8, 60070.00, NULL, '2026-03-16 18:48:25.496709');
INSERT INTO public.historico_faturamento VALUES (199, 3, 2018, 9, 134660.00, NULL, '2026-03-16 18:48:25.529181');
INSERT INTO public.historico_faturamento VALUES (200, 3, 2018, 10, 23150.00, NULL, '2026-03-16 18:48:25.562357');
INSERT INTO public.historico_faturamento VALUES (201, 3, 2018, 11, 120580.00, NULL, '2026-03-16 18:48:25.5961');
INSERT INTO public.historico_faturamento VALUES (202, 3, 2018, 12, 98498.73, NULL, '2026-03-16 18:48:25.629218');
INSERT INTO public.historico_faturamento VALUES (203, 3, 2019, 1, 27526.54, NULL, '2026-03-16 18:48:25.666');
INSERT INTO public.historico_faturamento VALUES (204, 3, 2019, 2, 3237.36, NULL, '2026-03-16 18:48:25.700104');
INSERT INTO public.historico_faturamento VALUES (205, 3, 2019, 3, 49176.35, NULL, '2026-03-16 18:48:25.732825');
INSERT INTO public.historico_faturamento VALUES (206, 3, 2019, 4, 57910.26, NULL, '2026-03-16 18:48:25.766255');
INSERT INTO public.historico_faturamento VALUES (207, 3, 2019, 5, 124232.66, NULL, '2026-03-16 18:48:25.798404');
INSERT INTO public.historico_faturamento VALUES (208, 3, 2019, 6, 1157.92, NULL, '2026-03-16 18:48:25.835956');
INSERT INTO public.historico_faturamento VALUES (209, 3, 2019, 7, 313169.83, NULL, '2026-03-16 18:48:25.871655');
INSERT INTO public.historico_faturamento VALUES (210, 3, 2019, 8, 91865.03, NULL, '2026-03-16 18:48:25.909194');
INSERT INTO public.historico_faturamento VALUES (211, 3, 2019, 9, 21892.41, NULL, '2026-03-16 18:48:25.94765');
INSERT INTO public.historico_faturamento VALUES (212, 3, 2019, 10, 31422.48, NULL, '2026-03-16 18:48:25.9796');
INSERT INTO public.historico_faturamento VALUES (213, 3, 2019, 11, 158976.61, NULL, '2026-03-16 18:48:26.013918');
INSERT INTO public.historico_faturamento VALUES (214, 3, 2019, 12, 274226.55, NULL, '2026-03-16 18:48:26.048193');
INSERT INTO public.historico_faturamento VALUES (215, 3, 2020, 1, 42471.90, NULL, '2026-03-16 18:48:26.080418');
INSERT INTO public.historico_faturamento VALUES (216, 3, 2020, 2, 55956.42, NULL, '2026-03-16 18:48:26.114185');
INSERT INTO public.historico_faturamento VALUES (217, 3, 2020, 3, 132197.97, NULL, '2026-03-16 18:48:26.148419');
INSERT INTO public.historico_faturamento VALUES (218, 3, 2020, 4, 59329.51, NULL, '2026-03-16 18:48:26.182738');
INSERT INTO public.historico_faturamento VALUES (219, 3, 2020, 5, 15675.42, NULL, '2026-03-16 18:48:26.215055');
INSERT INTO public.historico_faturamento VALUES (220, 3, 2020, 6, 26531.00, NULL, '2026-03-16 18:48:26.251886');
INSERT INTO public.historico_faturamento VALUES (289, 3, 2020, 7, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (221, 3, 2020, 8, 21620.11, NULL, '2026-03-16 18:48:26.295878');
INSERT INTO public.historico_faturamento VALUES (222, 3, 2020, 9, 63864.90, NULL, '2026-03-16 18:48:26.329735');
INSERT INTO public.historico_faturamento VALUES (223, 3, 2020, 10, 102740.00, NULL, '2026-03-16 18:48:26.360647');
INSERT INTO public.historico_faturamento VALUES (224, 3, 2020, 11, 132082.40, NULL, '2026-03-16 18:48:26.396106');
INSERT INTO public.historico_faturamento VALUES (225, 3, 2020, 12, 77197.70, NULL, '2026-03-16 18:48:26.430882');
INSERT INTO public.historico_faturamento VALUES (226, 3, 2021, 1, 10281.00, NULL, '2026-03-16 18:48:26.465418');
INSERT INTO public.historico_faturamento VALUES (227, 3, 2021, 2, 15413.00, NULL, '2026-03-16 18:48:26.498854');
INSERT INTO public.historico_faturamento VALUES (228, 3, 2021, 3, 4900.00, NULL, '2026-03-16 18:48:26.539439');
INSERT INTO public.historico_faturamento VALUES (229, 3, 2021, 4, 69617.50, NULL, '2026-03-16 18:48:26.578712');
INSERT INTO public.historico_faturamento VALUES (290, 3, 2021, 5, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (230, 3, 2021, 6, 54315.70, NULL, '2026-03-16 18:48:26.61293');
INSERT INTO public.historico_faturamento VALUES (231, 3, 2021, 7, 124543.20, NULL, '2026-03-16 18:48:26.64766');
INSERT INTO public.historico_faturamento VALUES (232, 3, 2021, 8, 59593.30, NULL, '2026-03-16 18:48:26.686901');
INSERT INTO public.historico_faturamento VALUES (233, 3, 2021, 9, 75946.40, NULL, '2026-03-16 18:48:26.722277');
INSERT INTO public.historico_faturamento VALUES (234, 3, 2021, 10, 140139.35, NULL, '2026-03-16 18:48:26.760491');
INSERT INTO public.historico_faturamento VALUES (235, 3, 2021, 11, 163697.20, NULL, '2026-03-16 18:48:26.787119');
INSERT INTO public.historico_faturamento VALUES (236, 3, 2021, 12, 435856.88, NULL, '2026-03-16 18:48:26.824747');
INSERT INTO public.historico_faturamento VALUES (237, 3, 2022, 1, 19976.95, NULL, '2026-03-16 18:48:26.859578');
INSERT INTO public.historico_faturamento VALUES (238, 3, 2022, 2, 14386.00, NULL, '2026-03-16 18:48:26.897684');
INSERT INTO public.historico_faturamento VALUES (239, 3, 2022, 3, 23033.00, NULL, '2026-03-16 18:48:26.932994');
INSERT INTO public.historico_faturamento VALUES (291, 3, 2022, 4, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (292, 3, 2022, 5, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (240, 3, 2022, 6, 13288.00, NULL, '2026-03-16 18:48:26.970432');
INSERT INTO public.historico_faturamento VALUES (293, 3, 2022, 7, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (241, 3, 2022, 8, 15835.00, NULL, '2026-03-16 18:48:27.010859');
INSERT INTO public.historico_faturamento VALUES (242, 3, 2022, 9, 85880.00, NULL, '2026-03-16 18:48:27.044595');
INSERT INTO public.historico_faturamento VALUES (243, 3, 2022, 10, 38070.80, NULL, '2026-03-16 18:48:27.081058');
INSERT INTO public.historico_faturamento VALUES (294, 3, 2022, 11, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (295, 3, 2022, 12, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (296, 3, 2023, 1, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (297, 3, 2023, 2, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (298, 3, 2023, 3, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (299, 3, 2023, 4, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (300, 3, 2023, 5, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (301, 3, 2023, 6, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (302, 3, 2023, 7, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (303, 3, 2023, 8, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (304, 3, 2023, 9, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (244, 3, 2023, 10, 118962.20, NULL, '2026-03-16 18:48:27.11373');
INSERT INTO public.historico_faturamento VALUES (245, 3, 2023, 11, 89888.00, NULL, '2026-03-16 18:48:27.148885');
INSERT INTO public.historico_faturamento VALUES (246, 3, 2023, 12, 95630.18, NULL, '2026-03-16 18:48:27.18915');
INSERT INTO public.historico_faturamento VALUES (305, 3, 2024, 1, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (247, 3, 2024, 2, 53472.50, NULL, '2026-03-16 18:48:27.227576');
INSERT INTO public.historico_faturamento VALUES (248, 3, 2024, 3, 59034.20, NULL, '2026-03-16 18:48:27.26518');
INSERT INTO public.historico_faturamento VALUES (249, 3, 2024, 4, 138393.09, NULL, '2026-03-16 18:48:27.303816');
INSERT INTO public.historico_faturamento VALUES (250, 3, 2024, 5, 159733.60, NULL, '2026-03-16 18:48:27.344416');
INSERT INTO public.historico_faturamento VALUES (251, 3, 2024, 6, 60267.10, NULL, '2026-03-16 18:48:27.380938');
INSERT INTO public.historico_faturamento VALUES (252, 3, 2024, 7, 104590.80, NULL, '2026-03-16 18:48:27.415059');
INSERT INTO public.historico_faturamento VALUES (253, 3, 2024, 8, 15504.01, NULL, '2026-03-16 18:48:27.447566');
INSERT INTO public.historico_faturamento VALUES (254, 3, 2024, 9, 45437.11, NULL, '2026-03-16 18:48:27.483543');
INSERT INTO public.historico_faturamento VALUES (255, 3, 2024, 10, 60842.11, NULL, '2026-03-16 18:48:27.523401');
INSERT INTO public.historico_faturamento VALUES (256, 3, 2024, 11, 50641.10, NULL, '2026-03-16 18:48:27.561443');
INSERT INTO public.historico_faturamento VALUES (257, 3, 2024, 12, 30421.63, NULL, '2026-03-16 18:48:27.595595');
INSERT INTO public.historico_faturamento VALUES (258, 3, 2025, 1, 30585.00, NULL, '2026-03-16 18:48:27.631051');
INSERT INTO public.historico_faturamento VALUES (306, 3, 2025, 2, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (307, 3, 2025, 3, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (308, 3, 2025, 4, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (309, 3, 2025, 5, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (310, 3, 2025, 6, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (311, 3, 2025, 7, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (312, 3, 2025, 8, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (313, 3, 2025, 9, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (314, 3, 2025, 10, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (315, 3, 2025, 11, 0.00, NULL, '2026-05-20 16:25:13.55095');
INSERT INTO public.historico_faturamento VALUES (316, 3, 2025, 12, 0.00, NULL, '2026-05-20 16:25:13.55095');


--
-- Data for Name: log_auditoria; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.log_auditoria VALUES (1, 1, 'Administrador', 'CRIAR', 'usuarios', 'Usuário criado: Usuário Teste (teste@empresa.com) · Perfil: Fiscal', NULL, '{"nome":"Usuário Teste","email":"teste@empresa.com","perfil":"Fiscal"}', NULL, '2026-03-16 21:14:32.579548');
INSERT INTO public.log_auditoria VALUES (2, 1, 'Administrador', 'IMPORTAR', 'notas', '7 notas importadas via XML · Empresa: SIX · 5 Venda', NULL, '{"empresa":"six","total":7,"vendas":5,"notas":["1035","1036","1037","1038","1039","1040","1041"]}', NULL, '2026-04-06 13:30:57.41652');
INSERT INTO public.log_auditoria VALUES (3, 1, 'Administrador', 'IMPORTAR', 'notas', '15 notas importadas via XML · Empresa: SIX · 10 Venda', NULL, '{"empresa":"six","total":15,"vendas":10,"notas":["1020","1021","1022","1023","1024","1025","1026","1027","1028","1029","1030","1031","1032","1033","1034"]}', NULL, '2026-04-06 13:32:24.484274');
INSERT INTO public.log_auditoria VALUES (4, 1, 'Administrador', 'IMPORTAR', 'notas', '7 notas importadas via XML · Empresa: SIX · 6 Venda', NULL, '{"empresa":"six","total":7,"vendas":6,"notas":["1042","1043","1044","1045","1046","1047","1048"]}', NULL, '2026-04-06 13:34:24.495355');
INSERT INTO public.log_auditoria VALUES (5, 1, 'Administrador', 'IMPORTAR', 'notas', '15 notas importadas via XML · Empresa: SIX · 10 Venda', NULL, '{"empresa":"six","total":15,"vendas":10,"notas":["1020","1021","1022","1023","1024","1025","1026","1027","1028","1029","1030","1031","1032","1033","1034"]}', NULL, '2026-04-06 17:50:22.501545');
INSERT INTO public.log_auditoria VALUES (6, 1, 'Administrador', 'IMPORTAR', 'notas', '7 notas importadas via XML · Empresa: SIX · 5 Venda', NULL, '{"empresa":"six","total":7,"vendas":5,"notas":["1035","1036","1037","1038","1039","1040","1041"]}', NULL, '2026-04-06 18:00:00.26934');
INSERT INTO public.log_auditoria VALUES (7, 1, 'Administrador', 'IMPORTAR', 'notas', '7 notas importadas via XML · Empresa: SIX · 5 Venda', NULL, '{"empresa":"six","total":7,"vendas":5,"notas":["1035","1036","1037","1038","1039","1040","1041"]}', NULL, '2026-04-06 18:01:12.696997');
INSERT INTO public.log_auditoria VALUES (8, 1, 'Administrador', 'IMPORTAR', 'notas', '15 notas importadas via XML · Empresa: SIX · 10 Venda', NULL, '{"empresa":"six","total":15,"vendas":10,"notas":["1020","1021","1022","1023","1024","1025","1026","1027","1028","1029","1030","1031","1032","1033","1034"]}', NULL, '2026-04-07 13:19:14.885282');
INSERT INTO public.log_auditoria VALUES (9, 1, 'Administrador', 'IMPORTAR', 'notas', '7 notas importadas via XML · Empresa: SIX · 5 Venda', NULL, '{"empresa":"six","total":7,"vendas":5,"notas":["1035","1036","1037","1038","1039","1040","1041"]}', NULL, '2026-04-07 13:20:09.393596');
INSERT INTO public.log_auditoria VALUES (10, 1, 'Administrador', 'IMPORTAR', 'notas', '7 notas importadas via XML · Empresa: SIX · 6 Venda', NULL, '{"empresa":"six","total":7,"vendas":6,"notas":["1042","1043","1044","1045","1046","1047","1048"]}', NULL, '2026-04-07 13:20:34.195499');
INSERT INTO public.log_auditoria VALUES (11, 1, 'Administrador', 'IMPORTAR', 'notas', '15 notas importadas via XML · Empresa: SIX · 10 Venda', NULL, '{"empresa":"six","total":15,"vendas":10,"notas":["1020","1021","1022","1023","1024","1025","1026","1027","1028","1029","1030","1031","1032","1033","1034"]}', NULL, '2026-04-07 13:31:10.344042');
INSERT INTO public.log_auditoria VALUES (12, 1, 'Administrador', 'IMPORTAR', 'notas', '23 notas importadas via XML · Empresa: SIX · 14 Venda', NULL, '{"empresa":"six","total":23,"vendas":14,"notas":["372","373","374","375","376","377","378","379","380","381","381-CAN","382","382-CAN","383","383-CAN","384","385","386","386-CAN","387","388","389","390"]}', NULL, '2026-04-07 17:28:49.936369');
INSERT INTO public.log_auditoria VALUES (13, 1, 'Administrador', 'IMPORTAR', 'notas', '23 notas importadas via XML · Empresa: ENOVA · 14 Venda', NULL, '{"empresa":"enova","total":23,"vendas":14,"notas":["372","373","374","375","376","377","378","379","380","381","381-CAN","382","382-CAN","383","383-CAN","384","385","386","386-CAN","387","388","389","390"]}', NULL, '2026-04-07 17:29:27.221155');
INSERT INTO public.log_auditoria VALUES (14, 1, 'Administrador', 'IMPORTAR', 'notas', '23 notas importadas via XML · Empresa: SIX · 14 Venda', NULL, '{"empresa":"six","total":23,"vendas":14,"notas":["372","373","374","375","376","377","378","379","380","381","381-CAN","382","382-CAN","383","383-CAN","384","385","386","386-CAN","387","388","389","390"]}', NULL, '2026-04-07 17:34:34.44991');
INSERT INTO public.log_auditoria VALUES (15, 1, 'Administrador', 'IMPORTAR', 'notas', '23 notas importadas via XML · Empresa: ENOVA · 14 Venda', NULL, '{"empresa":"enova","total":23,"vendas":14,"notas":["372","373","374","375","376","377","378","379","380","381","381-CAN","382","382-CAN","383","383-CAN","384","385","386","386-CAN","387","388","389","390"]}', NULL, '2026-04-07 17:41:35.884328');
INSERT INTO public.log_auditoria VALUES (16, 1, 'Administrador', 'IMPORTAR', 'notas', '1 nota importada via XML · Empresa: ENOVA · 0 Venda', NULL, '{"empresa":"enova","total":1,"vendas":0,"notas":["386-CCE"]}', NULL, '2026-04-07 18:13:40.863325');
INSERT INTO public.log_auditoria VALUES (17, 1, 'Administrador', 'IMPORTAR', 'notas', '23 notas importadas via XML · Empresa: SIX · 14 Venda', NULL, '{"empresa":"six","total":23,"vendas":14,"notas":["372","373","374","375","376","377","378","379","380","381","381-CAN","382","382-CAN","383","383-CAN","384","385","386","386-CCE","387","388","389","390"]}', NULL, '2026-04-07 18:27:51.064827');
INSERT INTO public.log_auditoria VALUES (18, 1, 'Administrador', 'IMPORTAR', 'notas', '23 notas importadas via XML · Empresa: ENOVA · 14 Venda', NULL, '{"empresa":"enova","total":23,"vendas":14,"notas":["372","373","374","375","376","377","378","379","380","381","381-CAN","382","382-CAN","383","383-CAN","384","385","386","386-CCE","387","388","389","390"]}', NULL, '2026-04-07 18:28:37.148809');
INSERT INTO public.log_auditoria VALUES (19, 1, 'Administrador', 'IMPORTAR', 'notas', '9 notas importadas via XML · Empresa: ENOVA · 7 Venda', NULL, '{"empresa":"enova","total":9,"vendas":7,"notas":["391","392","393","393-CAN","394","395","396","397","398"]}', NULL, '2026-04-07 18:30:21.859468');
INSERT INTO public.log_auditoria VALUES (20, 1, 'Administrador', 'IMPORTAR', 'notas', '18 notas importadas via XML · Empresa: ENOVA · 10 Venda', NULL, '{"empresa":"enova","total":18,"vendas":10,"notas":["399","400","401","402","403","404","405","406","408","409","410","411","411-CCE","412","413","414","415","416"]}', NULL, '2026-04-07 18:30:41.934103');
INSERT INTO public.log_auditoria VALUES (21, 1, 'Administrador', 'IMPORTAR', 'notas', '1 nota importada via XML · Empresa: ENOVA · 0 Venda', NULL, '{"empresa":"enova","total":1,"vendas":0,"notas":["407-INUT"]}', NULL, '2026-04-07 18:37:41.841181');
INSERT INTO public.log_auditoria VALUES (22, 1, 'Administrador', 'IMPORTAR', 'notas', '15 notas importadas via XML · Empresa: SIX · 10 Venda', NULL, '{"empresa":"six","total":15,"vendas":10,"notas":["1020","1021","1022","1023","1024","1025","1026","1027","1028","1029","1030","1031","1032","1033","1034"]}', NULL, '2026-04-08 13:01:35.233332');
INSERT INTO public.log_auditoria VALUES (23, 1, 'Administrador', 'IMPORTAR', 'notas', '7 notas importadas via XML · Empresa: SIX · 5 Venda', NULL, '{"empresa":"six","total":7,"vendas":5,"notas":["1035","1036","1037","1038","1039","1040","1041"]}', NULL, '2026-04-08 13:01:49.436859');
INSERT INTO public.log_auditoria VALUES (24, 1, 'Administrador', 'IMPORTAR', 'notas', '7 notas importadas via XML · Empresa: SIX · 6 Venda', NULL, '{"empresa":"six","total":7,"vendas":6,"notas":["1042","1043","1044","1045","1046","1047","1048"]}', NULL, '2026-04-08 13:02:01.492013');
INSERT INTO public.log_auditoria VALUES (25, 1, 'Administrador', 'IMPORTAR', 'notas', '3 notas importadas via XML · Empresa: SIX · 2 Venda', NULL, '{"empresa":"six","total":3,"vendas":2,"notas":["1048","1048-CAN","1049"]}', NULL, '2026-04-22 15:49:53.030829');
INSERT INTO public.log_auditoria VALUES (26, 1, 'Administrador', 'IMPORTAR', 'notas', '15 notas importadas via XML · Empresa: SIX · 12 Venda', NULL, '{"empresa":"six","total":15,"vendas":12,"notas":["1050","1050-CCE","1051","1052","1053","1054","1055","1056","1057","1058","1059","1060","1061","1062","1063"]}', NULL, '2026-05-04 13:51:10.234338');
INSERT INTO public.log_auditoria VALUES (27, 1, 'Administrador', 'IMPORTAR', 'notas', '22 notas importadas via XML · Empresa: ENOVA · 9 Venda', NULL, '{"empresa":"enova","total":22,"vendas":9,"notas":["417","418","419","420","420-CAN","421","422","423","424","425","426","427","427-CCE","428","429","429-CAN","430","431","432","433","434","435"]}', NULL, '2026-05-04 13:51:39.072438');
INSERT INTO public.log_auditoria VALUES (28, 1, 'Administrador', 'IMPORTAR', 'notas', '15 notas importadas via XML · Empresa: SIX · 10 Venda', NULL, '{"empresa":"six","total":15,"vendas":10,"notas":["1020","1021","1022","1023","1024","1025","1026","1027","1028","1029","1030","1031","1032","1033","1034"]}', NULL, '2026-05-04 17:40:30.414797');
INSERT INTO public.log_auditoria VALUES (92, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-19 15:09:55.523489');
INSERT INTO public.log_auditoria VALUES (93, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-19 15:23:17.274125');
INSERT INTO public.log_auditoria VALUES (29, 1, 'Administrador', 'IMPORTAR', 'notas', '23 notas importadas via XML · Empresa: ENOVA · 14 Venda', NULL, '{"empresa":"enova","total":23,"vendas":14,"notas":["372","373","374","375","376","377","378","379","380","381","381-CAN","382","382-CAN","383","383-CAN","384","385","386","386-CCE","387","388","389","390"]}', NULL, '2026-05-04 17:41:05.621203');
INSERT INTO public.log_auditoria VALUES (30, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatório completo Abr/2026 exportado', NULL, NULL, NULL, '2026-05-05 13:34:14.029065');
INSERT INTO public.log_auditoria VALUES (31, 1, 'Administrador', 'EXPORTAR', 'excel', 'Faturamento mensal histórico exportado · 74 registros', NULL, NULL, NULL, '2026-05-05 13:34:22.349734');
INSERT INTO public.log_auditoria VALUES (32, 1, 'Administrador', 'EXPORTAR', 'excel', 'DAS histórico exportado · SIX (38) + ENOVA (20) meses', NULL, NULL, NULL, '2026-05-05 13:34:31.049779');
INSERT INTO public.log_auditoria VALUES (33, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatório completo Abr/2026 exportado', NULL, NULL, NULL, '2026-05-05 13:35:30.123407');
INSERT INTO public.log_auditoria VALUES (34, 1, 'Administrador', 'EXPORTAR', 'excel', 'Faturamento mensal histórico exportado · 74 registros', NULL, NULL, NULL, '2026-05-05 13:37:54.795479');
INSERT INTO public.log_auditoria VALUES (35, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-05 14:00:31.339938');
INSERT INTO public.log_auditoria VALUES (36, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-05 14:08:08.925366');
INSERT INTO public.log_auditoria VALUES (37, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-05 14:20:31.116888');
INSERT INTO public.log_auditoria VALUES (38, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-05 14:23:08.236361');
INSERT INTO public.log_auditoria VALUES (39, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-05 14:31:02.667568');
INSERT INTO public.log_auditoria VALUES (40, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-05 14:34:07.510638');
INSERT INTO public.log_auditoria VALUES (41, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-05 14:50:13.995025');
INSERT INTO public.log_auditoria VALUES (42, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 17:28:47.635534');
INSERT INTO public.log_auditoria VALUES (43, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 17:44:24.363285');
INSERT INTO public.log_auditoria VALUES (44, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 17:44:53.257394');
INSERT INTO public.log_auditoria VALUES (45, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 17:53:51.921678');
INSERT INTO public.log_auditoria VALUES (46, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 17:54:51.269517');
INSERT INTO public.log_auditoria VALUES (47, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 21:37:09.564203');
INSERT INTO public.log_auditoria VALUES (48, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 21:47:04.804505');
INSERT INTO public.log_auditoria VALUES (49, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 21:57:03.865238');
INSERT INTO public.log_auditoria VALUES (50, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 21:57:20.034752');
INSERT INTO public.log_auditoria VALUES (51, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 22:00:04.180479');
INSERT INTO public.log_auditoria VALUES (52, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 22:04:04.272513');
INSERT INTO public.log_auditoria VALUES (53, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 22:10:38.34388');
INSERT INTO public.log_auditoria VALUES (54, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 22:13:46.320603');
INSERT INTO public.log_auditoria VALUES (55, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 22:17:32.346005');
INSERT INTO public.log_auditoria VALUES (56, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 22:19:57.401608');
INSERT INTO public.log_auditoria VALUES (57, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 22:21:43.837478');
INSERT INTO public.log_auditoria VALUES (58, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:00:37.312221');
INSERT INTO public.log_auditoria VALUES (59, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:01:59.668302');
INSERT INTO public.log_auditoria VALUES (60, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:02:15.318039');
INSERT INTO public.log_auditoria VALUES (61, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:02:55.587241');
INSERT INTO public.log_auditoria VALUES (62, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:05:49.738437');
INSERT INTO public.log_auditoria VALUES (63, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:14:04.573433');
INSERT INTO public.log_auditoria VALUES (64, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:16:37.26612');
INSERT INTO public.log_auditoria VALUES (65, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:17:35.01617');
INSERT INTO public.log_auditoria VALUES (66, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:18:04.469971');
INSERT INTO public.log_auditoria VALUES (67, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:20:46.833782');
INSERT INTO public.log_auditoria VALUES (68, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:22:38.269327');
INSERT INTO public.log_auditoria VALUES (69, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-14 23:24:00.566971');
INSERT INTO public.log_auditoria VALUES (70, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-15 13:48:36.059607');
INSERT INTO public.log_auditoria VALUES (71, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-15 13:51:45.201117');
INSERT INTO public.log_auditoria VALUES (72, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-15 13:57:08.946817');
INSERT INTO public.log_auditoria VALUES (73, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-15 14:06:55.748902');
INSERT INTO public.log_auditoria VALUES (74, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-15 14:10:29.92124');
INSERT INTO public.log_auditoria VALUES (75, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-15 14:17:37.297671');
INSERT INTO public.log_auditoria VALUES (76, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-15 14:23:46.110592');
INSERT INTO public.log_auditoria VALUES (77, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-15 14:33:15.61357');
INSERT INTO public.log_auditoria VALUES (78, 1, 'Administrador', 'EDITAR', 'usuarios', 'Usuário editado: Miriam (miriam@enovaonline.com.br)', '{"nome":"Usuário Teste","email":"teste@empresa.com","perfil":"Fiscal"}', '{"nome":"Miriam","email":"miriam@enovaonline.com.br","perfil":"Leitura"}', NULL, '2026-05-15 17:04:20.041995');
INSERT INTO public.log_auditoria VALUES (79, 1, 'Administrador', 'CRIAR', 'usuarios', 'Usuário criado: Rafael (rafael@enovaonline.com.br) · Perfil: Fiscal', NULL, '{"nome":"Rafael","email":"rafael@enovaonline.com.br","perfil":"Fiscal"}', NULL, '2026-05-15 18:16:06.895544');
INSERT INTO public.log_auditoria VALUES (80, 1, 'Administrador', 'EXPORTAR', 'excel', 'Faturamento mensal histórico exportado · 74 registros', NULL, NULL, NULL, '2026-05-15 18:17:55.537422');
INSERT INTO public.log_auditoria VALUES (81, 1, 'Administrador', 'EXPORTAR', 'excel', 'DAS histórico exportado · SIX (51) + ENOVA (21) meses', NULL, NULL, NULL, '2026-05-15 18:18:44.300728');
INSERT INTO public.log_auditoria VALUES (82, 1, 'Administrador', 'EDITAR', 'configuracoes', 'Empresa SIX atualizada', NULL, NULL, NULL, '2026-05-15 18:28:08.163151');
INSERT INTO public.log_auditoria VALUES (83, 1, 'Administrador', 'EDITAR', 'configuracoes', 'Empresa CM atualizada', NULL, NULL, NULL, '2026-05-15 18:28:17.016749');
INSERT INTO public.log_auditoria VALUES (84, 1, 'Administrador', 'EDITAR', 'configuracoes', 'Empresa ENOVA atualizada', NULL, NULL, NULL, '2026-05-15 18:28:20.748295');
INSERT INTO public.log_auditoria VALUES (85, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-18 20:35:17.4373');
INSERT INTO public.log_auditoria VALUES (86, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-18 20:36:42.127527');
INSERT INTO public.log_auditoria VALUES (87, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-18 20:41:13.849697');
INSERT INTO public.log_auditoria VALUES (88, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Gabriel Schiochet Lima', NULL, NULL, NULL, '2026-05-19 14:30:36.621194');
INSERT INTO public.log_auditoria VALUES (89, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-19 14:31:11.766531');
INSERT INTO public.log_auditoria VALUES (90, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-19 14:35:17.528224');
INSERT INTO public.log_auditoria VALUES (91, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-19 15:07:03.196299');
INSERT INTO public.log_auditoria VALUES (94, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-19 15:23:50.703639');
INSERT INTO public.log_auditoria VALUES (96, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-19 16:37:24.903365');
INSERT INTO public.log_auditoria VALUES (95, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-19 16:37:03.618461');
INSERT INTO public.log_auditoria VALUES (97, 1, 'Administrador', 'EXPORTAR', 'excel', 'Relatorio completo exportado', NULL, NULL, NULL, '2026-05-19 17:56:16.176629');
INSERT INTO public.log_auditoria VALUES (98, 1, 'Administrador', 'EDITAR', 'encargos', 'Funcionário atualizado: Henrique Fernandes Lima', NULL, NULL, NULL, '2026-05-19 18:14:57.92769');
INSERT INTO public.log_auditoria VALUES (99, 1, 'Administrador', 'CONFIRMAR', 'das', 'DAS confirmado: SIX · Abr/2026 · R$ 88,32', NULL, '{"empresa":"SIX","ano":2026,"mes":5,"valor":88.32}', NULL, '2026-05-20 18:36:37.93071');
INSERT INTO public.log_auditoria VALUES (100, 1, 'Administrador', 'CONFIRMAR', 'das', 'DAS confirmado: ENOVA · Abr/2026 · R$ 11351,12', NULL, '{"empresa":"ENOVA","ano":2026,"mes":5,"valor":11351.12}', NULL, '2026-05-20 18:36:42.973537');
INSERT INTO public.log_auditoria VALUES (101, 1, 'Administrador', 'EXPORTAR', 'excel', 'Faturamento mensal histórico exportado · 93 registros', NULL, NULL, NULL, '2026-05-21 12:27:51.472095');
INSERT INTO public.log_auditoria VALUES (102, 1, 'Administrador', 'CONFIRMAR', 'das', 'DAS confirmado: SIX · Abr/2026 · R$ 86,28', NULL, '{"empresa":"SIX","ano":2026,"mes":5,"valor":86.28}', NULL, '2026-05-25 18:01:13.569654');
INSERT INTO public.log_auditoria VALUES (103, 1, 'Administrador', 'CONFIRMAR', 'das', 'DAS confirmado: ENOVA · Abr/2026 · R$ 11343,48', NULL, '{"empresa":"ENOVA","ano":2026,"mes":5,"valor":11343.48}', NULL, '2026-05-25 18:01:41.356936');
INSERT INTO public.log_auditoria VALUES (104, 1, 'Administrador', 'CONFIRMAR', 'das', 'DAS confirmado: ENOVA · Abr/2026 · R$ 9729,50', NULL, '{"empresa":"ENOVA","ano":2026,"mes":5,"valor":9729.5}', NULL, '2026-05-28 17:39:28.307382');


--
-- Data for Name: notas_fiscais; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.notas_fiscais VALUES (182, 2, '403', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 384.5, '13/03/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:30:41.351062', NULL);
INSERT INTO public.notas_fiscais VALUES (187, 2, '409', 'Starnet Logistica Ltda', '23713161000128', 3948, '23/03/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:30:41.586039', NULL);
INSERT INTO public.notas_fiscais VALUES (208, 1, '1031', 'Aline Teixeira', '09420515729', 7095, '15/01/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-08 10:01:35.025863', NULL);
INSERT INTO public.notas_fiscais VALUES (233, 1, '1054', 'ESCOLA DE NATACAO E GINASTICA BIOMORUM LTDA', '58410341000204', 2787, '10/04/2026', 2787, '01/05/2026', 'Venda', 'Venda', '2026-05-04 10:51:09.829101', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (159, 2, '383', 'BRASIF S A ADMINISTRACAO E PARTICIPACOES', '21109731000140', 760, '19/01/2026', NULL, NULL, 'Venda', 'Venda', '2026-04-07 15:28:36.676607', NULL);
INSERT INTO public.notas_fiscais VALUES (164, 2, '386-CCE', 'MAXUM MAQUINAS E EQUIPAMENTOS LTDA', '02227267000141', 0, '04/02/2026', NULL, NULL, 'Carta de Correcao', 'Carta de Correcao', '2026-04-07 15:28:36.8834', NULL);
INSERT INTO public.notas_fiscais VALUES (149, 2, '375', 'Credito Real Imoveis e Condominios S.A.', '92691336000166', 3053.93, '06/01/2026', 3053.93, '21/01/2026', 'Venda', 'Venda', '2026-04-07 15:28:36.356414', 'fev/2026');
INSERT INTO public.notas_fiscais VALUES (154, 2, '380', 'Criarte - Producoes E Eventos Ltda', '07444899000180', 11620, '19/01/2026', 11620, '30/01/2026', 'Venda', 'Venda', '2026-04-07 15:28:36.524203', 'fev/2026');
INSERT INTO public.notas_fiscais VALUES (169, 2, '391', 'Rockwell Automation do Brasil Ltda', '46323754000183', 3721.05, '02/02/2026', 3721.05, '19/02/2026', 'Venda', 'Venda', '2026-04-07 15:30:21.513707', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (216, 1, '1039', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978020012', 650, '10/02/2026', 650, '03/03/2026', 'Venda', 'Venda', '2026-04-08 10:01:49.29833', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (219, 1, '1042', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978020012', 1229, '02/03/2026', 1229, '23/03/2026', 'Venda', 'Venda', '2026-04-08 10:02:01.189928', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (224, 1, '1047', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069001806', 1000, '09/03/2026', 1000, '30/03/2026', 'Venda', 'Venda', '2026-04-08 10:02:01.383095', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (192, 2, '413', 'ACONTECE PRODUCAO GRAFICA E EVENTOS LTDA', '03105840000107', 4059, '26/03/2026', 4059, '09/04/2026', 'Venda', 'Venda', '2026-04-07 15:30:41.770825', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (203, 1, '1026', 'ESCOLA DE NATACAO E GINASTICA BIOMORUM LTDA', '58410341000115', 2096, '12/01/2026', 2096, '02/02/2026', 'Venda', 'Venda', '2026-04-08 10:01:34.873261', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (228, 1, '1050', 'CLARIANT BRASIL LTDA.', '31452113000151', 4163, '01/04/2026', NULL, NULL, 'Venda', 'Venda', '2026-05-04 10:51:09.635579', NULL);
INSERT INTO public.notas_fiscais VALUES (238, 1, '1059', 'PERFIG DISTRIBUICAO E MALA DIRETA LTDA.', '58925926000178', 40590, '16/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:09.985717', NULL);
INSERT INTO public.notas_fiscais VALUES (246, 2, '420', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 7657, '13/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:38.46153', NULL);
INSERT INTO public.notas_fiscais VALUES (251, 2, '424', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001838', 11915, '15/04/2026', NULL, NULL, 'Venda', 'Venda', '2026-05-04 10:51:38.61533', NULL);
INSERT INTO public.notas_fiscais VALUES (256, 2, '428', 'Biomm S A', '04752991000624', 17480, '20/04/2026', NULL, NULL, 'Venda', 'Venda', '2026-05-04 10:51:38.771634', NULL);
INSERT INTO public.notas_fiscais VALUES (261, 2, '432', 'Biomm S A', '04752991000624', 17480, '27/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:38.912232', NULL);
INSERT INTO public.notas_fiscais VALUES (174, 2, '395', 'COLEGIO SANTA RITA LTDA', '06964348000185', 20250, '10/02/2026', 20250, '16/04/2026', 'Venda', 'Venda', '2026-04-07 15:30:21.695149', NULL);
INSERT INTO public.notas_fiscais VALUES (227, 1, '1049', 'CLARIANT BRASIL LTDA.', '31452113000151', 11716, '31/03/2026', 0, '', 'Venda', 'Venda', '2026-04-22 12:49:52.882061', NULL);
INSERT INTO public.notas_fiscais VALUES (198, 1, '1021', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978021094', 1500, '07/01/2026', 1500, '28/01/2026', 'Venda', 'Venda', '2026-04-08 10:01:34.685903', 'fev/2026');
INSERT INTO public.notas_fiscais VALUES (183, 2, '404', 'Starnet Logistica Ltda', '23713161000128', 27581, '16/03/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:30:41.399217', NULL);
INSERT INTO public.notas_fiscais VALUES (196, 2, '407-INUT', 'INUTILIZADA', '', 0, '24/03/2026', NULL, NULL, 'Inutilizacao', 'Inutilizacao', '2026-04-07 15:37:41.799763', NULL);
INSERT INTO public.notas_fiscais VALUES (204, 1, '1027', 'Marcelo Rezende', '08896549728', 5160, '13/01/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-08 10:01:34.905289', NULL);
INSERT INTO public.notas_fiscais VALUES (209, 1, '1032', 'Editora Sextante', '02310771000100', 166.63, '15/01/2026', NULL, NULL, 'Remessa em bonificacao, doacao ou brinde', 'Remessa em bonificacao, doacao ou brinde', '2026-04-08 10:01:35.063229', NULL);
INSERT INTO public.notas_fiscais VALUES (212, 1, '1035', 'AGILE RP EXPRESS LOGISTICA E DISTRIBUICAO LTDA', '15251232000190', 10965, '02/02/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-08 10:01:49.148876', NULL);
INSERT INTO public.notas_fiscais VALUES (146, 2, '372', 'STEPAN QUIMICA LTDA', '01898598000493', 5078, '05/01/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:28:36.234526', NULL);
INSERT INTO public.notas_fiscais VALUES (156, 2, '381-CAN', 'BRASIF S A EXPORTACAO IMPORTACAO', '52226073002577', 0, '19/01/2026', NULL, NULL, 'Cancelamento', 'Cancelamento', '2026-04-07 15:28:36.589244', NULL);
INSERT INTO public.notas_fiscais VALUES (229, 1, '1050-CCE', 'CLARIANT BRASIL LTDA.', '31452113000151', 0, '13/04/2026', NULL, NULL, 'Carta de Correcao', 'Carta de Correcao', '2026-05-04 10:51:09.688373', NULL);
INSERT INTO public.notas_fiscais VALUES (166, 2, '388', 'Newage Eventos Ltda', '40126442000101', 7200, '20/01/2026', 7200, '20/01/2026', 'Venda', 'Venda', '2026-04-07 15:28:36.975013', 'fev/2026');
INSERT INTO public.notas_fiscais VALUES (170, 2, '392', 'Instituto Da Oportunidade Social', '02449283000502', 4690, '02/02/2026', 4690, '17/02/2026', 'Venda', 'Venda', '2026-04-07 15:30:21.553449', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (262, 2, '433', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 5698, '27/04/2026', NULL, NULL, 'Venda', 'Venda', '2026-05-04 10:51:38.943024', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (193, 2, '414', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 37286, '27/03/2026', 37286, '24/04/2026', 'Venda', 'Venda', '2026-04-07 15:30:41.800076', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (225, 1, '1048', 'CLARIANT BRASIL LTDA.', '31452113000151', 4187, '31/03/2026', NULL, NULL, 'Venda', 'Venda', '2026-04-08 10:02:01.417725', NULL);
INSERT INTO public.notas_fiscais VALUES (239, 1, '1060', 'CLARIANT BRASIL LTDA.', '31452113000151', 2947.6, '20/04/2026', NULL, NULL, 'Venda', 'Venda', '2026-05-04 10:51:10.014134', NULL);
INSERT INTO public.notas_fiscais VALUES (247, 2, '420-CAN', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 0, '13/04/2026', NULL, NULL, 'Cancelamento', 'Cancelamento', '2026-05-04 10:51:38.490783', NULL);
INSERT INTO public.notas_fiscais VALUES (252, 2, '425', 'COLEGIO SANTA RITA LTDA', '06964348000185', 20250, '17/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:38.649542', NULL);
INSERT INTO public.notas_fiscais VALUES (257, 2, '429', 'Flora', '08195519000184', 10785, '22/04/2026', NULL, NULL, 'Venda', 'Venda', '2026-05-04 10:51:38.800273', NULL);
INSERT INTO public.notas_fiscais VALUES (178, 2, '399', 'STEPAN QUIMICA LTDA', '01898598000140', 2031.9, '06/03/2026', 2031.9, '20/03/2026', 'Venda', 'Venda', '2026-04-07 15:30:41.158703', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (217, 1, '1040', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069002535', 2187, '10/02/2026', 2187, '03/03/2026', 'Venda', 'Venda', '2026-04-08 10:01:49.335564', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (234, 1, '1055', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978020012', 1000, '13/04/2026', 1000, '04/05/2026', 'Venda', 'Venda', '2026-05-04 10:51:09.858186', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (220, 1, '1043', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978021094', 1193, '02/03/2026', 1193, '23/03/2026', 'Venda', 'Venda', '2026-04-08 10:02:01.240252', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (175, 2, '396', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001838', 9540, '20/02/2026', 9540, '13/04/2026', 'Venda', 'Venda', '2026-04-07 15:30:21.73036', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (161, 2, '384', 'BRASIF S A EXPORTACAO IMPORTACAO', '52226073002577', 12880, '20/01/2026', 12880, '03/02/2026', 'Venda', 'Venda', '2026-04-07 15:28:36.752416', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (188, 2, '410', 'Banco BTG Pactual S A', '30306294000226', 2844.36, '25/03/2026', 2844.36, '09/04/2026', 'Venda', 'Venda', '2026-04-07 15:30:41.62686', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (199, 1, '1022', 'ESCOLA DE APLICACAO SAO JOSE DOS CAMPOS LTDA', '23973137000128', 9874, '07/01/2026', 9874, '28/01/2026', 'Venda', 'Venda', '2026-04-08 10:01:34.722892', 'fev/2026');
INSERT INTO public.notas_fiscais VALUES (151, 2, '377', 'Editora Sextante', '02310771000100', 3522.45, '06/01/2026', 3522.45, '21/01/2026', 'Venda', 'Venda', '2026-04-07 15:28:36.428675', 'fev/2026');
INSERT INTO public.notas_fiscais VALUES (171, 2, '393', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001838', 7950, '06/02/2026', NULL, NULL, 'Venda', 'Venda', '2026-04-07 15:30:21.593419', NULL);
INSERT INTO public.notas_fiscais VALUES (179, 2, '400', 'STEPAN QUIMICA LTDA', '01898598000221', 2031.9, '06/03/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:30:41.208902', NULL);
INSERT INTO public.notas_fiscais VALUES (184, 2, '405', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 3948, '16/03/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:30:41.448292', NULL);
INSERT INTO public.notas_fiscais VALUES (210, 1, '1033', 'Jose Catelani', '36884838809', 2580, '15/01/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-08 10:01:35.095294', NULL);
INSERT INTO public.notas_fiscais VALUES (218, 1, '1041', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978020012', 2650, '23/02/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-08 10:01:49.3667', NULL);
INSERT INTO public.notas_fiscais VALUES (253, 2, '426', 'Associacao Brasileira A Hebraica De Sao Paulo', '61139911000199', 4445, '17/04/2026', 4445, '24/04/2026', 'Venda', 'Venda', '2026-05-04 10:51:38.68705', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (230, 1, '1051', 'GERDAU ACOS LONGOS S.A.', '07358761004075', 40590, '01/04/2026', 40590, '01/05/2026', 'Venda', 'Venda', '2026-05-04 10:51:09.727196', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (147, 2, '373', 'STEPAN QUIMICA LTDA', '01898598000221', 5334, '05/01/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:28:36.275356', NULL);
INSERT INTO public.notas_fiscais VALUES (152, 2, '378', 'Credito Real Imoveis e Condominios S.A.', '92691336000166', 3053.93, '07/01/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:28:36.462724', NULL);
INSERT INTO public.notas_fiscais VALUES (157, 2, '382', 'MAXUM MAQUINAS E EQUIPAMENTOS LTDA', '02227267000141', 2280, '19/01/2026', NULL, NULL, 'Venda', 'Venda', '2026-04-07 15:28:36.620471', NULL);
INSERT INTO public.notas_fiscais VALUES (235, 1, '1056', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978021094', 1000, '13/04/2026', 1000, '04/05/2026', 'Venda', 'Venda', '2026-05-04 10:51:09.890878', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (240, 1, '1061', 'ROHTO-MENTHOLATUM DO BRASIL COMERCIO DE PRODUTOS PARA SAUDE', '14739675000161', 12120, '28/04/2026', NULL, NULL, 'Venda', 'Venda', '2026-05-04 10:51:10.045119', NULL);
INSERT INTO public.notas_fiscais VALUES (243, 2, '417', 'Biomm S A', '04752991000624', 4100, '01/04/2026', NULL, NULL, 'Venda', 'Venda', '2026-05-04 10:51:38.361046', NULL);
INSERT INTO public.notas_fiscais VALUES (248, 2, '421', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 7657, '13/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:38.522213', NULL);
INSERT INTO public.notas_fiscais VALUES (258, 2, '429-CAN', 'Flora', '08195519000184', 0, '22/04/2026', NULL, NULL, 'Cancelamento', 'Cancelamento', '2026-05-04 10:51:38.827947', NULL);
INSERT INTO public.notas_fiscais VALUES (263, 2, '434', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 518, '29/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:38.967422', NULL);
INSERT INTO public.notas_fiscais VALUES (167, 2, '389', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001161', 32784.5, '21/01/2026', 32784.5, '20/02/2026', 'Venda', 'Venda', '2026-04-07 15:28:37.020607', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (176, 2, '397', 'Karcher Industria E Comercio Limitada', '47110960000178', 1870.2, '24/02/2026', 1870.2, '24/03/2026', 'Venda', 'Venda', '2026-04-07 15:30:21.762276', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (213, 1, '1036', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978020012', 4500, '09/02/2026', 4500, '02/03/2026', 'Venda', 'Venda', '2026-04-08 10:01:49.191972', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (221, 1, '1044', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069005631', 1229, '02/03/2026', 1229, '23/03/2026', 'Venda', 'Venda', '2026-04-08 10:02:01.279041', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (189, 2, '411', 'ACONTECE PRODUCAO GRAFICA E EVENTOS LTDA', '03105840000107', 2100, '26/03/2026', 2100, '09/04/2026', 'Venda', 'Venda', '2026-04-07 15:30:41.67171', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (194, 2, '415', 'Skintec Comercial Importadora e Exportadora Ltda', '01915618000144', 6200, '26/03/2026', 6200, '09/04/2026', 'Venda', 'Venda', '2026-04-07 15:30:41.827906', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (162, 2, '385', 'BRASIF S A ADMINISTRACAO E PARTICIPACOES', '21109731000140', 910, '20/01/2026', 910, '05/02/2026', 'Venda', 'Venda', '2026-04-07 15:28:36.794987', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (200, 1, '1023', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069001482', 2031.3, '12/01/2026', 2031.3, '02/02/2026', 'Venda', 'Venda', '2026-04-08 10:01:34.758737', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (205, 1, '1028', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069002454', 1733, '13/01/2026', 1733, '03/02/2026', 'Venda', 'Venda', '2026-04-08 10:01:34.938015', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (172, 2, '393-CAN', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001838', 0, '09/02/2026', NULL, NULL, 'Cancelamento', 'Cancelamento', '2026-04-07 15:30:21.628313', NULL);
INSERT INTO public.notas_fiscais VALUES (177, 2, '398', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001838', 7950, '26/02/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:30:21.793076', NULL);
INSERT INTO public.notas_fiscais VALUES (190, 2, '411-CCE', 'ACONTECE PRODUCAO GRAFICA E EVENTOS LTDA', '03105840000107', 0, '27/03/2026', NULL, NULL, 'Carta de Correcao', 'Carta de Correcao', '2026-04-07 15:30:41.708333', NULL);
INSERT INTO public.notas_fiscais VALUES (195, 2, '416', 'Skintec Comercial Importadora e Exportadora Ltda', '01915618000144', 6200, '27/03/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:30:41.854277', NULL);
INSERT INTO public.notas_fiscais VALUES (211, 1, '1034', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978021094', 4500, '26/01/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-08 10:01:35.130343', NULL);
INSERT INTO public.notas_fiscais VALUES (222, 1, '1045', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978020012', 16505, '02/03/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-08 10:02:01.311634', NULL);
INSERT INTO public.notas_fiscais VALUES (206, 1, '1029', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069002020', 2160, '13/01/2026', 2160, '03/02/2026', 'Venda', 'Venda', '2026-04-08 10:01:34.968678', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (148, 2, '374', 'STEPAN QUIMICA LTDA', '01898598000140', 4062, '05/01/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:28:36.313483', NULL);
INSERT INTO public.notas_fiscais VALUES (158, 2, '382-CAN', 'MAXUM MAQUINAS E EQUIPAMENTOS LTDA', '02227267000141', 0, '19/01/2026', NULL, NULL, 'Cancelamento', 'Cancelamento', '2026-04-07 15:28:36.649147', NULL);
INSERT INTO public.notas_fiscais VALUES (168, 2, '390', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001161', 18734, '27/01/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-04-07 15:28:37.067582', NULL);
INSERT INTO public.notas_fiscais VALUES (244, 2, '418', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 20894, '01/04/2026', 20894, '07/05/2026', 'Venda', 'Venda', '2026-05-04 10:51:38.395398', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (259, 2, '430', 'ASPAS COMUNICACAO LTDA', '08195519000184', 10785, '22/04/2026', 10785, '07/05/2026', 'Venda', 'Venda', '2026-05-04 10:51:38.857281', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (231, 1, '1052', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069001806', 1000, '06/04/2026', 1000, '27/04/2026', 'Venda', 'Venda', '2026-05-04 10:51:09.763243', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (236, 1, '1057', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069005631', 1000, '13/04/2026', 1000, '04/05/2026', 'Venda', 'Venda', '2026-05-04 10:51:09.925424', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (241, 1, '1062', 'TVH BRASIL PECAS LTDA', '03747886000120', 2462.2, '29/04/2026', NULL, NULL, 'Venda', 'Venda', '2026-05-04 10:51:10.078624', NULL);
INSERT INTO public.notas_fiscais VALUES (249, 2, '422', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001838', 9540, '13/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:38.559839', NULL);
INSERT INTO public.notas_fiscais VALUES (254, 2, '427', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001838', 11915, '17/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:38.714546', NULL);
INSERT INTO public.notas_fiscais VALUES (264, 2, '435', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 5180, '29/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:38.992399', NULL);
INSERT INTO public.notas_fiscais VALUES (185, 2, '406', 'EMNIFY BRASIL LTDA', '45953596000182', 14417, '23/03/2026', 14417, '20/03/2026', 'Venda', 'Venda', '2026-04-07 15:30:41.499634', NULL);
INSERT INTO public.notas_fiscais VALUES (153, 2, '379', 'SP. SUMARE PRODUTOS DE HIGIENE LTDA', '40595809000390', 15773.85, '12/01/2026', 15773.85, '06/01/2026', 'Venda', 'Venda', '2026-04-07 15:28:36.490514', 'fev/2026');
INSERT INTO public.notas_fiscais VALUES (214, 1, '1037', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978021094', 5000, '09/02/2026', 5000, '02/03/2026', 'Venda', 'Venda', '2026-04-08 10:01:49.223781', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (180, 2, '401', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 31913.5, '11/03/2026', 31913.5, '13/04/2026', 'Venda', 'Venda', '2026-04-07 15:30:41.258052', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (163, 2, '386', 'MAXUM MAQUINAS E EQUIPAMENTOS LTDA', '02227267000141', 2430, '20/01/2026', 2430, '10/02/2026', 'Venda', 'Venda', '2026-04-07 15:28:36.841702', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (201, 1, '1024', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069002101', 2000, '12/01/2026', 2000, '02/02/2026', 'Venda', 'Venda', '2026-04-08 10:01:34.796181', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (186, 2, '408', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 3948, '23/03/2026', NULL, NULL, 'Devolucao de simples remessa', 'Devolucao de simples remessa', '2026-04-07 15:30:41.544392', NULL);
INSERT INTO public.notas_fiscais VALUES (260, 2, '431', 'POUPE SUPERMERCADOS LTDA', '08378878000339', 16538.4, '23/04/2026', 16538.4, '13/05/2026', 'Venda', 'Venda', '2026-05-04 10:51:38.886968', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (232, 1, '1053', 'EUROFARMA LABORATORIOS S.A.', '61190096002217', 39210.5, '08/04/2026', 39210.5, '08/05/2026', 'Venda', 'Venda', '2026-05-04 10:51:09.798095', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (237, 1, '1058', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069006107', 1000, '13/04/2026', 1000, '04/05/2026', 'Venda', 'Venda', '2026-05-04 10:51:09.955095', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (242, 1, '1063', 'CLARIANT BRASIL LTDA.', '31452113000151', 2947.6, '30/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:10.112237', NULL);
INSERT INTO public.notas_fiscais VALUES (245, 2, '419', 'Cli Central Logistica Integrada Ltda', '13528071000103', 4100, '10/04/2026', NULL, NULL, 'Simples Remessa', 'Simples Remessa', '2026-05-04 10:51:38.434154', NULL);
INSERT INTO public.notas_fiscais VALUES (250, 2, '423', 'I.F.C. INDUSTRIA E COMERCIO DE CONDUTORES ELETRICOS LTDA', '02544042000119', 0, '15/04/2026', NULL, NULL, 'Remessa de amostra gratis', 'Remessa de amostra gratis', '2026-05-04 10:51:38.584453', NULL);
INSERT INTO public.notas_fiscais VALUES (255, 2, '427-CCE', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001838', 0, '20/04/2026', NULL, NULL, 'Carta de Correcao', 'Carta de Correcao', '2026-05-04 10:51:38.743724', NULL);
INSERT INTO public.notas_fiscais VALUES (181, 2, '402', 'SONY PICTURES RELEASING OF BRASIL INC', '33040767000101', 7657, '11/03/2026', 7657, '13/04/2026', 'Venda', 'Venda', '2026-04-07 15:30:41.30428', NULL);
INSERT INTO public.notas_fiscais VALUES (173, 2, '394', 'PEARSON EDUCATION DO BRASIL LTDA', '01404158001838', 7950, '06/02/2026', 7950, '20/03/2026', 'Venda', 'Venda', '2026-04-07 15:30:21.66284', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (191, 2, '412', 'ACONTECE PRODUCAO GRAFICA E EVENTOS LTDA', '03105840000107', 2027.71, '26/03/2026', 2027.71, '09/04/2026', 'Venda', 'Venda', '2026-04-07 15:30:41.739226', 'mai/2026');
INSERT INTO public.notas_fiscais VALUES (207, 1, '1030', 'SMARTFIT ESCOLA DE GINASTICA E DANCA S.A.', '07594978020012', 2000, '13/01/2026', 2000, '03/02/2026', 'Venda', 'Venda', '2026-04-08 10:01:34.99641', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (197, 1, '1020', 'INTERNATIONAL GLOBAL SOL. G. E DES. DE SOFTWARES LTDA', '08832132000191', 6590, '06/01/2026', 6590, '19/02/2026', 'Venda', 'Venda', '2026-04-08 10:01:34.646398', 'mar/2026');
INSERT INTO public.notas_fiscais VALUES (155, 2, '381', 'BRASIF S A EXPORTACAO IMPORTACAO', '52226073002577', 12920, '19/01/2026', NULL, NULL, 'Venda', 'Venda', '2026-04-07 15:28:36.557647', NULL);
INSERT INTO public.notas_fiscais VALUES (160, 2, '383-CAN', 'BRASIF S A ADMINISTRACAO E PARTICIPACOES', '21109731000140', 0, '19/01/2026', NULL, NULL, 'Cancelamento', 'Cancelamento', '2026-04-07 15:28:36.715077', NULL);
INSERT INTO public.notas_fiscais VALUES (165, 2, '387', 'Newage Eventos Ltda', '40126442000101', 1940, '20/01/2026', 1940, '20/01/2026', 'Venda', 'Venda', '2026-04-07 15:28:36.930761', 'fev/2026');
INSERT INTO public.notas_fiscais VALUES (226, 1, '1048-CAN', 'CLARIANT BRASIL LTDA.', '31452113000151', 0, '01/04/2026', NULL, NULL, 'Cancelamento', 'Cancelamento', '2026-04-22 12:49:52.754424', NULL);
INSERT INTO public.notas_fiscais VALUES (215, 1, '1038', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069005631', 3354, '09/02/2026', 3354, '02/03/2026', 'Venda', 'Venda', '2026-04-08 10:01:49.260768', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (223, 1, '1046', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069000915', 1000, '05/03/2026', 1000, '26/03/2026', 'Venda', 'Venda', '2026-04-08 10:02:01.35104', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (150, 2, '376', 'Karcher Industria E Comercio Limitada', '47110960000178', 36037.05, '06/01/2026', 36037.05, '05/03/2026', 'Venda', 'Venda', '2026-04-07 15:28:36.39255', 'abr/2026');
INSERT INTO public.notas_fiscais VALUES (202, 1, '1025', 'ESCOLA DE NATACAO E GINASTICA BIOSWIM LTDA', '00318069000915', 1000, '12/01/2026', 1000, '02/02/2026', 'Venda', 'Venda', '2026-04-08 10:01:34.835731', 'mar/2026');


--
-- Data for Name: pagamentos_nf; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.pagamentos_nf VALUES (70, 227, 1, '1049', 0, '', '2026-04-23 21:14:54.779355', NULL);
INSERT INTO public.pagamentos_nf VALUES (75, 174, 2, '395', 6600, '24/02/2026', '2026-04-23 21:21:10.922213', 'mar/2026');
INSERT INTO public.pagamentos_nf VALUES (100, 185, 2, '406', 14417, '20/03/2026', '2026-05-04 11:54:37.738088', 'abr/2026');
INSERT INTO public.pagamentos_nf VALUES (101, 181, 2, '402', 7657, '13/04/2026', '2026-05-04 11:56:02.847662', 'mai/2026');
INSERT INTO public.pagamentos_nf VALUES (99, 174, 2, '395', 7050, '16/04/2026', '2026-05-04 10:53:28.767729', 'mai/2026');
INSERT INTO public.pagamentos_nf VALUES (98, 174, 2, '395', 6600, '01/04/2026', '2026-05-04 10:52:54.574995', 'abr/2026');


--
-- Data for Name: permissoes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.permissoes VALUES (1, 1, 'dashboard', true, true, true, true);
INSERT INTO public.permissoes VALUES (2, 1, 'inicio', true, true, true, true);
INSERT INTO public.permissoes VALUES (3, 1, 'notas', true, true, true, true);
INSERT INTO public.permissoes VALUES (4, 1, 'impostos', true, true, true, true);
INSERT INTO public.permissoes VALUES (5, 1, 'contab', true, true, true, true);
INSERT INTO public.permissoes VALUES (6, 1, 'rel', true, true, true, true);
INSERT INTO public.permissoes VALUES (7, 1, 'empresas', true, true, true, true);
INSERT INTO public.permissoes VALUES (8, 1, 'usuarios', true, true, true, true);
INSERT INTO public.permissoes VALUES (9, 1, 'xml', true, true, true, true);
INSERT INTO public.permissoes VALUES (10, 1, 'exp', true, true, true, true);
INSERT INTO public.permissoes VALUES (11, 2, 'dashboard', true, false, false, false);
INSERT INTO public.permissoes VALUES (12, 2, 'inicio', true, false, false, false);
INSERT INTO public.permissoes VALUES (13, 2, 'notas', true, false, false, false);
INSERT INTO public.permissoes VALUES (14, 2, 'impostos', true, false, false, false);
INSERT INTO public.permissoes VALUES (15, 2, 'contab', true, false, false, false);
INSERT INTO public.permissoes VALUES (16, 2, 'rel', true, false, false, false);
INSERT INTO public.permissoes VALUES (17, 2, 'empresas', true, false, false, false);
INSERT INTO public.permissoes VALUES (18, 2, 'usuarios', true, false, false, false);
INSERT INTO public.permissoes VALUES (19, 2, 'xml', true, false, false, false);
INSERT INTO public.permissoes VALUES (20, 2, 'exp', true, false, false, false);
INSERT INTO public.permissoes VALUES (21, 3, 'dashboard', true, false, false, false);
INSERT INTO public.permissoes VALUES (22, 3, 'inicio', true, false, false, false);
INSERT INTO public.permissoes VALUES (23, 3, 'notas', true, false, false, false);
INSERT INTO public.permissoes VALUES (24, 3, 'impostos', true, false, false, false);
INSERT INTO public.permissoes VALUES (25, 3, 'contab', true, false, false, false);
INSERT INTO public.permissoes VALUES (26, 3, 'rel', true, false, false, false);
INSERT INTO public.permissoes VALUES (27, 3, 'empresas', true, false, false, false);
INSERT INTO public.permissoes VALUES (28, 3, 'usuarios', true, false, false, false);
INSERT INTO public.permissoes VALUES (29, 3, 'xml', true, false, false, false);
INSERT INTO public.permissoes VALUES (30, 3, 'exp', true, false, false, false);


--
-- Name: ajustes_devolucao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ajustes_devolucao_id_seq', 3, true);


--
-- Name: creditos_fiscais_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.creditos_fiscais_id_seq', 3, true);


--
-- Name: das_pagamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.das_pagamentos_id_seq', 205, true);


--
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.empresas_id_seq', 3, true);


--
-- Name: encargos_horas_extras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.encargos_horas_extras_id_seq', 1, true);


--
-- Name: feriados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.feriados_id_seq', 21, true);


--
-- Name: funcionarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.funcionarios_id_seq', 2, true);


--
-- Name: historico_faturamento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.historico_faturamento_id_seq', 316, true);


--
-- Name: log_auditoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.log_auditoria_id_seq', 104, true);


--
-- Name: notas_fiscais_new_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notas_fiscais_new_id_seq', 267, true);


--
-- Name: pagamentos_nf_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pagamentos_nf_id_seq', 102, true);


--
-- Name: permissoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permissoes_id_seq', 30, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 5Yg8Bynzk9CLsXOsi1KIGlVR2fXRC86rRbemdoAmoG5o8Aj4sw2uyYbTme0ZR7E

