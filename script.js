// ============================================================
        // CONFIGURAÇÕES
        // ============================================================
        const FEE_PER_DAY = 6.60; // Multa por dia de atraso
        const MAX_FEE_DAYS = 7; // Máximo de dias de multa

        let currentVehicle = null; // Dados do veículo atual
        let currentPlate = ''; // Placa atual
        let currentPage = 'debts'; // Página inicial: DÉBITOS

        // ============================================================
        // BANCO DE DADOS SIMULADO
        // ============================================================
        const vehicleDatabase = {
            "ABC1234": {
                plate: "ABC1234",
                vehicle: "Fiat Strada 2020",
                debts: [
                    { id: 1, dueDate: "15/03/2024", description: "IPVA 2024", amount: 1250.00, status: "pending",
                        originalAmount: 1250.00 },
                    { id: 2, dueDate: "30/04/2024", description: "Licenciamento Anual", amount: 185.00,
                        status: "pending", originalAmount: 185.00 }
                ],
                history: [
                    { paymentDate: "10/01/2024", description: "IPVA 2023", amount: 1200.00,
                        reference: "Parcela única" },
                    { paymentDate: "05/02/2024", description: "Multa de Trânsito", amount: 195.00,
                        reference: "Ato 123456" }
                ],
                maintenances: [
                    { date: "12/01/2024", description: "Troca de óleo e filtros",
                        parts: "Óleo 5W30, Filtro de óleo, Filtro de ar",
                        labor: 120.00, total: 380.00 },
                    { date: "20/03/2024", description: "Revisão dos freios", parts: "Pastilhas de freio dianteiras",
                        labor: 180.00, total: 320.00 }
                ]
            },
            "DEF5678": {
                plate: "DEF5678",
                vehicle: "Honda Civic 2019",
                debts: [
                    { id: 3, dueDate: "10/02/2024", description: "IPVA 2024 - 1ª Parcela", amount: 450.00,
                        status: "overdue", originalAmount: 450.00 },
                    { id: 4, dueDate: "10/03/2024", description: "IPVA 2024 - 2ª Parcela", amount: 450.00,
                        status: "overdue", originalAmount: 450.00 },
                    { id: 5, dueDate: "20/01/2024", description: "DPVAT", amount: 85.00, status: "overdue",
                        originalAmount: 85.00 }
                ],
                history: [
                    { paymentDate: "15/12/2023", description: "Licenciamento 2023", amount: 180.00,
                        reference: "Exercício 2023" }
                ],
                maintenances: [
                    { date: "05/02/2024", description: "Troca de pneus", parts: "Pneu Aro 17 (x4)", labor: 200.00,
                        total: 2800.00 },
                    { date: "18/03/2024", description: "Troca de óleo e filtros", parts: "Óleo 5W30, Filtro de óleo",
                        labor: 100.00, total: 280.00 },
                    { date: "02/04/2024", description: "Alinhamento e balanceamento", parts: "-", labor: 150.00,
                        total: 150.00 }
                ]
            },
            "GHI9012": {
                plate: "GHI9012",
                vehicle: "Volkswagen Gol 2022",
                debts: [],
                history: [
                    { paymentDate: "20/01/2024", description: "IPVA 2024", amount: 1100.00,
                        reference: "À vista" },
                    { paymentDate: "15/02/2024", description: "Licenciamento 2024", amount: 190.00,
                        reference: "Exercício 2024" }
                ],
                maintenances: [
                    { date: "10/01/2024", description: "Troca de óleo", parts: "Óleo 5W40", labor: 80.00,
                        total: 180.00 },
                    { date: "25/02/2024", description: "Revisão completa", parts: "Filtros, vela de ignição",
                        labor: 250.00, total: 450.00 }
                ]
            },
            "JKL3456": {
                plate: "JKL3456",
                vehicle: "Chevrolet Onix 2021",
                debts: [
                    { id: 6, dueDate: "05/05/2024", description: "IPVA 2024", amount: 980.00, status: "pending",
                        originalAmount: 980.00 },
                    { id: 7, dueDate: "20/06/2024", description: "Seguro Obrigatório", amount: 95.00,
                        status: "pending", originalAmount: 95.00 },
                    { id: 8, dueDate: "01/03/2024", description: "Multa - Radar", amount: 280.00,
                        status: "overdue", originalAmount: 280.00 }
                ],
                history: [
                    { paymentDate: "10/02/2023", description: "IPVA 2023", amount: 950.00,
                        reference: "Parcela única" },
                    { paymentDate: "15/03/2023", description: "Licenciamento 2023", amount: 175.00,
                        reference: "Exercício 2023" },
                    { paymentDate: "20/11/2023", description: "Multa - Estacionamento", amount: 150.00,
                        reference: "Auto 789" }
                ],
                maintenances: [
                    { date: "15/01/2024", description: "Troca de óleo", parts: "Óleo 5W30, Filtro de óleo",
                        labor: 90.00, total: 220.00 },
                    { date: "10/02/2024", description: "Troca de pastilhas de freio",
                        parts: "Pastilhas dianteiras e traseiras", labor: 160.00, total: 350.00 },
                    { date: "05/03/2024", description: "Troca de bateria", parts: "Bateria 60Ah", labor: 50.00,
                        total: 450.00 }
                ]
            }
        };

        // ============================================================
        // FUNÇÕES AUXILIARES
        // ============================================================

        /** Normaliza a placa removendo espaços e hífens */
        function normalizePlate(plate) {
            return plate.replace(/[\s-]/g, '').toUpperCase();
        }

        /** Valida o formato da placa (antigo ou Mercosul) */
        function isValidPlate(plate) {
            const n = normalizePlate(plate);
            return /^[A-Z]{3}\d{4}$/.test(n) || /^[A-Z]{3}\d[A-Z]\d{2}$/.test(n);
        }

        /** Busca os dados do veículo no banco simulado */
        function getVehicleData(plate) {
            return vehicleDatabase[normalizePlate(plate)] || null;
        }

        /** Converte string de data DD/MM/AAAA para Date */
        function parseDate(dateStr) {
            const parts = dateStr.split('/');
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }

        /** Calcula quantos dias um débito está atrasado */
        function calculateOverdueDays(dueDateStr) {
            const today = new Date();
            const dueDate = parseDate(dueDateStr);
            if (dueDate >= today) return 0;
            const diffTime = today - dueDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return Math.min(diffDays, MAX_FEE_DAYS);
        }

        /** Calcula o valor total com multa, se houver atraso */
        function calculateTotalWithFee(originalAmount, dueDate, status) {
            if (status !== 'overdue') return originalAmount;
            const daysOverdue = calculateOverdueDays(dueDate);
            if (daysOverdue === 0) return originalAmount;
            return originalAmount + (daysOverdue * FEE_PER_DAY);
        }

        /** Retorna detalhes da multa para exibição */
        function getFeeDetail(originalAmount, dueDate, status) {
            if (status !== 'overdue') return null;
            const daysOverdue = calculateOverdueDays(dueDate);
            if (daysOverdue === 0) return null;
            const fee = daysOverdue * FEE_PER_DAY;
            return { days: daysOverdue, fee: fee, total: originalAmount + fee };
        }

        /** Formata um valor para moeda brasileira */
        function formatCurrency(value) {
            return 'R$ ' + value.toFixed(2);
        }

        /** Retorna o rótulo do status */
        function getStatusLabel(status) {
            const labels = {
                'pending': '⏳ Pendente',
                'overdue': '⚠️ Atrasado',
                'paid': '✅ Pago'
            };
            return labels[status] || status;
        }

        // ============================================================
        // SIDEBAR
        // ============================================================

        /** Abre/fecha a sidebar */
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
        }

        /** Fecha a sidebar */
        function closeSidebar() {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebarOverlay').classList.remove('active');
            document.body.style.overflow = '';
        }

        /** Navega para uma página específica */
        function navigateTo(page) {
            currentPage = page;

            // Atualiza o item ativo na sidebar
            document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
                item.classList.toggle('active', item.dataset.page === page);
            });

            // Mostra a página correspondente
            document.querySelectorAll('.page').forEach(p => {
                p.classList.toggle('active', p.id === 'page-' + page);
            });

            // FECHA A SIDEBAR EM QUALQUER DISPOSITIVO
            closeSidebar();

            // Renderiza o conteúdo da página
            if (currentVehicle) {
                renderPageContent(page);
            }
        }

        /** Atualiza as informações do veículo na sidebar */
        function updateSidebarVehicle(vehicle, plate) {
            const modelEl = document.getElementById('sidebarVehicleModel');
            const plateEl = document.getElementById('sidebarVehiclePlate');
            const debtBadge = document.getElementById('sidebarDebtBadge');
            const maintBadge = document.getElementById('sidebarMaintenanceBadge');

            if (vehicle) {
                modelEl.textContent = vehicle.vehicle;
                plateEl.textContent = plate;

                // Atualiza badge de débitos
                const debtCount = vehicle.debts.length;
                debtBadge.textContent = debtCount;
                debtBadge.style.display = debtCount > 0 ? 'inline-block' : 'none';

                // Atualiza badge de manutenções
                const maintCount = (vehicle.maintenances || []).length;
                maintBadge.textContent = maintCount;
                maintBadge.style.display = maintCount > 0 ? 'inline-block' : 'none';
            } else {
                modelEl.textContent = 'Nenhum veículo';
                plateEl.textContent = '---';
                debtBadge.textContent = '0';
                debtBadge.style.display = 'none';
                maintBadge.textContent = '0';
                maintBadge.style.display = 'none';
            }
        }

        // ============================================================
        // HELP / ABOUT
        // ============================================================

        function showHelp() {
            showAlert(document.getElementById('dashboardAlert'),
                '💡 <strong>Como usar:</strong><br>• Digite a placa do veículo<br>• Clique em "PIX" para pagar<br>• Copie o código PIX ou use o QR Code',
                'info');
            if (window.innerWidth <= 768) closeSidebar();
        }

        function showAbout() {
            showAlert(document.getElementById('dashboardAlert'),
                '🚗 <strong>SuaveConsulta v2.0</strong><br>Consulte débitos veiculares de forma rápida e segura.<br><br>🔷 Dados simulados para demonstração.',
                'info');
            if (window.innerWidth <= 768) closeSidebar();
        }

        // ============================================================
        // PIX
        // ============================================================

        /** Gera um PIX de demonstração */
        function generateDemoPix(debt, totalAmount) {
            const demoId = `DEMO_${debt.id}_${Date.now()}`;
            const demoPixString =
                `00020126360014br.gov.bcb.pix0114${demoId}@mercadopago.com5204000053039865404${totalAmount.toFixed(2).replace('.', '')}5802BR5912DETRAN-SP6008SAO PAULO62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            const demoQrBase64 =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f4f8'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='%2364748b' font-size='12'%3E🔷 QR Code PIX%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' fill='%2364748b' font-size='10'%3EDemonstração%3C/text%3E%3Ctext x='50%25' y='75%25' text-anchor='middle' fill='%2300a86b' font-size='11'%3ER$ " +
                totalAmount.toFixed(2) + "%3C/text%3E%3C/svg%3E";
            return { qrCodeBase64: demoQrBase64, qrCodeString: demoPixString, paymentId: demoId, isDemo: true };
        }

        /** Exibe o QR Code PIX */
        async function displayPixQrCode(debt, totalAmount, plate) {
            const qrcodeArea = document.getElementById('qrcodeArea');
            const pixCodeElement = document.getElementById('pixCode');

            qrcodeArea.innerHTML = `<div class="loading-spinner"></div><span>Gerando PIX...</span>`;
            pixCodeElement.innerHTML = 'Gerando código PIX...';

            try {
                const pixData = generateDemoPix(debt, totalAmount);
                if (pixData.qrCodeBase64) {
                    qrcodeArea.innerHTML =
                        `<img src="${pixData.qrCodeBase64}" alt="QR Code PIX" style="width: 180px; height: 180px; border-radius: 12px;">`;
                }
                pixCodeElement.innerHTML = pixData.qrCodeString;
                if (pixData.isDemo) {
                    showAlert(document.getElementById('dashboardAlert'), '🔷 Modo demonstração', 'info');
                }
            } catch (error) {
                qrcodeArea.innerHTML =
                    `<div style="text-align: center; color: #dc2626;"><div style="font-size: 32px;">⚠️</div><span>Erro ao gerar PIX</span></div>`;
                pixCodeElement.innerHTML = 'Erro ao gerar código PIX. Tente novamente.';
            }
        }

        /** Abre o modal PIX com os dados do débito */
        function openPixModal(debt, plate) {
            document.getElementById('modalDebtDesc').textContent = debt.description;
            document.getElementById('modalDebtDueDate').textContent = debt.dueDate;
            const statusLabel = debt.status === 'overdue' ? '⚠️ Atrasado' : '⏳ Pendente';
            document.getElementById('modalDebtStatus').textContent = statusLabel;

            let finalAmount = debt.amount;
            const feeDetailEl = document.getElementById('modalFeeDetail');

            if (debt.status === 'overdue') {
                const feeInfo = getFeeDetail(debt.originalAmount, debt.dueDate, debt.status);
                if (feeInfo && feeInfo.fee > 0) {
                    finalAmount = feeInfo.total;
                    feeDetailEl.style.display = 'block';
                    feeDetailEl.innerHTML = `
                        <strong>💰 Multa por atraso:</strong><br>
                        ${feeInfo.days} dia(s) × R$ ${FEE_PER_DAY.toFixed(2)} = R$ ${feeInfo.fee.toFixed(2)}<br>
                        <strong>Total com multa:</strong> R$ ${feeInfo.total.toFixed(2)}
                    `;
                } else {
                    feeDetailEl.style.display = 'none';
                }
            } else {
                feeDetailEl.style.display = 'none';
            }

            document.getElementById('modalAmount').innerHTML = `R$ ${finalAmount.toFixed(2)}`;
            document.getElementById('pixModal').classList.add('active');
            displayPixQrCode(debt, finalAmount, plate);
        }

        /** Fecha o modal PIX */
        function closePixModal() {
            document.getElementById('pixModal').classList.remove('active');
        }

        /** Copia o código PIX para a área de transferência */
        function copyPixCode() {
            const code = document.getElementById('pixCode').innerText;
            if (code && code !== 'Carregando código PIX...' && code !== 'Erro ao gerar código PIX. Tente novamente.') {
                navigator.clipboard.writeText(code).then(() => {
                    showAlert(document.getElementById('dashboardAlert'), '✅ Código PIX copiado!', 'success');
                });
            }
        }

        // ============================================================
        // RENDERIZAÇÃO DAS PÁGINAS
        // ============================================================

        /** Renderiza o conteúdo da página atual */
        function renderPageContent(page) {
            if (!currentVehicle) return;

            switch (page) {
                case 'overview':
                    renderOverview();
                    break;
                case 'debts':
                    renderDebts();
                    break;
                case 'maintenance':
                    renderMaintenance();
                    break;
                case 'history':
                    renderHistory();
                    break;
                case 'summary':
                    renderSummary();
                    break;
            }
        }

        /** Renderiza a página de visão geral */
        function renderOverview() {
            const v = currentVehicle;
            let totalDebt = 0,
                overdueCount = 0,
                pendingCount = 0,
                totalPaid = 0;

            v.debts.forEach(debt => {
                let current = debt.amount;
                if (debt.status === 'overdue') {
                    current = calculateTotalWithFee(debt.originalAmount, debt.dueDate, debt.status);
                }
                totalDebt += current;
                if (debt.status === 'overdue') overdueCount++;
                else if (debt.status === 'pending') pendingCount++;
            });

            v.history.forEach(h => totalPaid += h.amount);

            const maintCount = (v.maintenances || []).length;
            const totalMaintCost = (v.maintenances || []).reduce((sum, m) => sum + m.total, 0);

            document.getElementById('statsGrid').innerHTML = `
                <div class="stat-item">
                    <div class="stat-icon">💰</div>
                    <div class="stat-value debt">${formatCurrency(totalDebt)}</div>
                    <div class="stat-label">Total em débito</div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon">⚠️</div>
                    <div class="stat-value debt">${overdueCount}</div>
                    <div class="stat-label">Atrasados</div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-value">${pendingCount}</div>
                    <div class="stat-label">Pendentes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon">✅</div>
                    <div class="stat-value success">${formatCurrency(totalPaid)}</div>
                    <div class="stat-label">Total pago</div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon">🔧</div>
                    <div class="stat-value">${maintCount}</div>
                    <div class="stat-label">Manutenções</div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon">🔩</div>
                    <div class="stat-value">${formatCurrency(totalMaintCost)}</div>
                    <div class="stat-label">Custo total</div>
                </div>
            `;
        }

        /** Renderiza a página de débitos - COM BOTÃO PIX APENAS ÍCONE */
        function renderDebts() {
            const v = currentVehicle;
            const container = document.getElementById('debtsContainer');

            if (v.debts.length === 0) {
                container.innerHTML =
                    `<div class="empty-state"><span class="emoji">🎉</span>Nenhum débito pendente!<br><span style="font-size:12px;color:#94a3b8;">Seu veículo está em dia.</span></div>`;
                return;
            }

            let html = `
                <table class="debt-table">
                    <thead>
                        <tr>
                            <th class="col-due">📅 Venc.</th>
                            <th class="col-desc">Descrição</th>
                            <th class="col-status">Status</th>
                            <th class="col-value">Valor</th>
                            <th class="col-action">Pagar</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            v.debts.forEach(debt => {
                let displayAmount = debt.amount,
                    originalDisplay = '',
                    feeDisplay = '';
                const statusLabel = debt.status === 'overdue' ? 'Atrasado' : 'Pendente';
                const statusBadge = debt.status === 'overdue' ? 'badge-overdue' : 'badge-pending';

                if (debt.status === 'overdue') {
                    const feeInfo = getFeeDetail(debt.originalAmount, debt.dueDate, debt.status);
                    if (feeInfo && feeInfo.fee > 0) {
                        originalDisplay = `<span class="original-amount">${formatCurrency(debt.originalAmount)}</span>`;
                        feeDisplay = `<span class="fee-info">+ ${formatCurrency(feeInfo.fee)}</span>`;
                        displayAmount = feeInfo.total;
                    }
                }

                html += `
                    <tr>
                        <td class="col-due"><strong>${debt.dueDate}</strong></td>
                        <td class="col-desc">${debt.description}</td>
                        <td class="col-status"><span class="badge ${statusBadge}">${statusLabel}</span></td>
                        <td class="col-value">${originalDisplay}<strong>${formatCurrency(displayAmount)}</strong>${feeDisplay}</td>
                        <td class="col-action">
                            <button class="btn-pix" onclick='openPixModal(${JSON.stringify(debt)}, "${currentPlate}")'>
                                <img src="https://img.icons8.com/?size=100&id=Dk4sj0EM4b20&format=png&color=000000" class="pix-icon-img" alt="PIX">
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        }

        /** Renderiza a página de manutenções */
        function renderMaintenance() {
            const v = currentVehicle;
            const container = document.getElementById('maintenanceContainer');
            const maintenances = v.maintenances || [];

            if (maintenances.length === 0) {
                container.innerHTML =
                    `<div class="empty-state"><span class="emoji">🔧</span>Nenhuma manutenção registrada<br><span style="font-size:12px;color:#94a3b8;">As manutenções aparecerão aqui.</span></div>`;
                return;
            }

            let html = `
                <table class="maintenance-table">
                    <thead>
                        <tr>
                            <th class="col-date">📅 Data</th>
                            <th class="col-desc">Serviço</th>
                            <th class="col-parts">Peças trocadas</th>
                            <th class="col-labor">Mão de obra</th>
                            <th class="col-total">Total</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            maintenances.forEach(m => {
                html += `
                    <tr>
                        <td class="col-date"><strong>${m.date}</strong></td>
                        <td class="col-desc">${m.description}</td>
                        <td class="col-parts">${m.parts || '-'}</td>
                        <td class="col-labor">${formatCurrency(m.labor)}</td>
                        <td class="col-total"><strong>${formatCurrency(m.total)}</strong></td>
                    </tr>
                `;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        }

        /** Renderiza a página de histórico */
        function renderHistory() {
            const v = currentVehicle;
            const container = document.getElementById('historyContainer');

            if (v.history.length === 0) {
                container.innerHTML =
                    `<div class="empty-state"><span class="emoji">📭</span>Nenhum histórico de pagamento<br><span style="font-size:12px;color:#94a3b8;">Os pagamentos aparecerão aqui.</span></div>`;
                return;
            }

            let html = `
                <table class="history-table">
                    <thead>
                        <tr>
                            <th class="col-date">📅 Data</th>
                            <th class="col-desc">Descrição</th>
                            <th class="col-amount">Valor</th>
                            <th class="col-ref">Referência</th>
                            <th class="col-status">Status</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            v.history.forEach(h => {
                html += `
                    <tr>
                        <td class="col-date">${h.paymentDate}</td>
                        <td class="col-desc">${h.description}</td>
                        <td class="col-amount"><strong>${formatCurrency(h.amount)}</strong></td>
                        <td class="col-ref">${h.reference}</td>
                        <td class="col-status"><span class="badge badge-paid">✅ Pago</span></td>
                    </tr>
                `;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        }

        /** Renderiza a página de resumo */
        function renderSummary() {
            const v = currentVehicle;
            const container = document.getElementById('summaryContainer');

            let totalDebt = 0,
                overdueCount = 0,
                pendingCount = 0,
                totalPaid = 0,
                totalOverdueAmount = 0,
                totalPendingAmount = 0;

            v.debts.forEach(debt => {
                let current = debt.amount;
                if (debt.status === 'overdue') {
                    current = calculateTotalWithFee(debt.originalAmount, debt.dueDate, debt.status);
                    totalOverdueAmount += current;
                    overdueCount++;
                } else if (debt.status === 'pending') {
                    totalPendingAmount += current;
                    pendingCount++;
                }
                totalDebt += current;
            });

            v.history.forEach(h => totalPaid += h.amount);

            const maintenances = v.maintenances || [];
            const totalMaint = maintenances.reduce((sum, m) => sum + m.total, 0);
            const maintCount = maintenances.length;

            const hasOverdue = overdueCount > 0;
            const hasPending = pendingCount > 0;
            const isAllPaid = v.debts.length === 0;

            let statusMessage = '',
                statusColor = '';
            if (isAllPaid) {
                statusMessage = '✅ Tudo em dia!';
                statusColor = '#059669';
            } else if (hasOverdue) {
                statusMessage = '⚠️ Atenção! Há débitos atrasados.';
                statusColor = '#dc2626';
            } else if (hasPending) {
                statusMessage = '⏳ Há débitos pendentes. Fique atento aos vencimentos.';
                statusColor = '#d97706';
            }

            container.innerHTML = `
                <div style="background: ${statusColor}10; border: 1px solid ${statusColor}30; border-radius: 20px; padding: 20px; margin-bottom: 24px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 700; color: ${statusColor};">${statusMessage}</div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Situação atual do veículo ${v.vehicle}</div>
                </div>

                <div class="stats-summary-grid">
                    <div class="stats-summary-card">
                        <div class="number debt">${formatCurrency(totalDebt)}</div>
                        <div class="label">💰 Total em débito</div>
                    </div>
                    <div class="stats-summary-card">
                        <div class="number success">${formatCurrency(totalPaid)}</div>
                        <div class="label">✅ Total já pago</div>
                    </div>
                    <div class="stats-summary-card">
                        <div class="number">${v.debts.length}</div>
                        <div class="label">📋 Débitos totais</div>
                    </div>
                    <div class="stats-summary-card">
                        <div class="number">${v.history.length}</div>
                        <div class="label">📜 Pagamentos realizados</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                    <div style="background: #fef3c7; padding: 16px; border-radius: 16px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #d97706;">${pendingCount}</div>
                        <div style="font-size: 12px; color: #92400e;">⏳ Pendentes</div>
                    </div>
                    <div style="background: #fee2e2; padding: 16px; border-radius: 16px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #dc2626;">${overdueCount}</div>
                        <div style="font-size: 12px; color: #991b1b;">⚠️ Atrasados</div>
                    </div>
                    <div style="background: #e0e7ff; padding: 16px; border-radius: 16px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #4f46e5;">${maintCount}</div>
                        <div style="font-size: 12px; color: #3730a3;">🔧 Manutenções</div>
                    </div>
                </div>

                ${hasOverdue ? `
                <div style="margin-top: 8px; background: #fee2e2; padding: 16px; border-radius: 16px; border-left: 4px solid #dc2626;">
                    <div style="font-size: 13px; font-weight: 600; color: #dc2626;">🔴 Débitos em atraso:</div>
                    <div style="font-size: 13px; color: #991b1b; margin-top: 4px;">${formatCurrency(totalOverdueAmount)} em débitos atrasados</div>
                    <div style="font-size: 11px; color: #991b1b; margin-top: 2px;">Multa de R$ ${FEE_PER_DAY.toFixed(2)} por dia de atraso (máx. ${MAX_FEE_DAYS} dias)</div>
                </div>
                ` : ''}

                ${maintCount > 0 ? `
                <div style="margin-top: 16px; background: #e0e7ff30; padding: 16px; border-radius: 16px; border-left: 4px solid #4f46e5;">
                    <div style="font-size: 13px; font-weight: 600; color: #4f46e5;">🔧 Resumo de manutenções:</div>
                    <div style="font-size: 13px; color: #3730a3; margin-top: 4px;">${maintCount} manutenção(ões) realizadas</div>
                    <div style="font-size: 13px; color: #3730a3;">Total gasto: <strong>${formatCurrency(totalMaint)}</strong></div>
                </div>
                ` : ''}

                <div style="margin-top: 16px; background: #f1f5f9; padding: 16px; border-radius: 16px; text-align: center; font-size: 12px; color: #64748b;">
                    🚗 <strong>${v.vehicle}</strong> • Placa <strong>${currentPlate}</strong>
                </div>
            `;
        }

        // ============================================================
        // UI
        // ============================================================

        /** Exibe um alerta no elemento especificado */
        function showAlert(element, message, type = 'error') {
            element.className = `alert alert-${type}`;
            element.innerHTML = message;
            element.style.display = 'block';
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }

        /** Preenche o campo de placa com um exemplo */
        function setExamplePlate(plate) {
            document.getElementById('plateInput').value = plate;
            document.getElementById('loginAlert').style.display = 'none';
        }

        /** Atualiza o dashboard com os dados do veículo */
        function updateDashboard(vehicle, plate) {
            currentVehicle = vehicle;
            currentPlate = plate;

            document.getElementById('plateDisplay').innerHTML = plate;
            document.getElementById('vehicleModel').innerHTML = vehicle.vehicle;

            updateSidebarVehicle(vehicle, plate);
            renderPageContent(currentPage);
        }

        // ============================================================
        // LOGIN / LOGOUT
        // ============================================================

        /** Função chamada ao clicar em "Consultar" */
        function handleLogin() {
            let plate = document.getElementById('plateInput').value.trim();
            const alertDiv = document.getElementById('loginAlert');
            alertDiv.style.display = 'none';

            if (!plate) {
                showAlert(alertDiv, 'Informe a placa do veículo', 'error');
                return;
            }
            if (!isValidPlate(plate)) {
                showAlert(alertDiv, 'Formato inválido! Ex: ABC1234', 'error');
                return;
            }

            const vehicle = getVehicleData(plate);
            if (!vehicle) {
                showAlert(alertDiv, 'Veículo não encontrado', 'error');
                return;
            }

            // Transição suave para o dashboard
            document.getElementById('loginScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('loginScreen').style.opacity = '1';
                document.getElementById('dashboard').classList.add('active');

                // Define a página inicial como DÉBITOS
                currentPage = 'debts';
                document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
                    item.classList.toggle('active', item.dataset.page === 'debts');
                });
                document.querySelectorAll('.page').forEach(p => {
                    p.classList.toggle('active', p.id === 'page-debts');
                });

                updateDashboard(vehicle, normalizePlate(plate));
            }, 200);

            document.getElementById('plateInput').value = '';
        }

        /** Função chamada ao clicar em "Nova consulta" */
        function handleLogout() {
            closeSidebar();
            document.getElementById('dashboard').classList.remove('active');
            document.getElementById('loginScreen').style.display = 'block';
            document.getElementById('plateInput').focus();

            currentVehicle = null;
            currentPlate = '';
            updateSidebarVehicle(null, '');

            // Limpa os containers
            document.getElementById('statsGrid').innerHTML = '';
            document.getElementById('debtsContainer').innerHTML = '';
            document.getElementById('maintenanceContainer').innerHTML = '';
            document.getElementById('historyContainer').innerHTML = '';
            document.getElementById('summaryContainer').innerHTML = '';
        }

        // ============================================================
        // EVENT LISTENERS
        // ============================================================

        // Enter no campo de placa
        document.getElementById('plateInput').addEventListener('keypress', e => {
            if (e.key === 'Enter') handleLogin();
        });

        // Tecla ESC fecha sidebar e modal
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                closeSidebar();
                const modal = document.getElementById('pixModal');
                if (modal.classList.contains('active')) closePixModal();
            }
        });

        // Clique fora do modal fecha
        document.getElementById('pixModal').addEventListener('click', function(e) {
            if (e.target === this) closePixModal();
        });

        // Ao carregar a página, foca no campo de placa
        window.addEventListener('load', () => {
            document.getElementById('plateInput').focus();
            updateSidebarVehicle(null, '');
        });