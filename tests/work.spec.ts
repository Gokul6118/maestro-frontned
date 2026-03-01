import { expect, test } from "@playwright/test";

const CONFIRM_REGEX = /confirm/i;
const UPDATE_REGEX = /update/i;
const EDIT_TODO_REGEX = /edit todo/i;

test.setTimeout(90_000);

test.describe("Work Page - CRUD Todo", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");

		await page.fill("#email", "hidas@gmail.com");
		await page.fill("#password", "12345678");

		await page.click('button[type="submit"]');

		await page.waitForURL("/work");

		await expect(page.getByText("Add Todo")).toBeVisible();
	});

	test("should create, edit and delete todo (stable)", async ({ page }) => {
		await page.getByText("Add Todo").click();

		await page.getByPlaceholder("Enter title").fill("My Test Todo");

		await page
			.getByPlaceholder("Enter description")
			.fill("This is a test todo");

		// Status
		await page.getByRole("combobox").click();
		await page.getByRole("option", { name: "Todo" }).click();

		// Date picker
		const dateBtn = page.getByRole("button", { name: "Pick a date" }).first();

		await dateBtn.click();

		await page
			.locator('[role="gridcell"]:not([data-disabled="true"])')
			.first()
			.click();

		await page.keyboard.press("Escape");

		// End date
		await dateBtn.click();

		await page
			.locator('[role="gridcell"]:not([data-disabled="true"])')
			.nth(1)
			.click();

		await page.keyboard.press("Escape");

		// Time
		await page.locator('input[type="time"]').first().fill("10:00");
		await page.locator('input[type="time"]').nth(1).fill("12:00");

		// Add
		await page.getByRole("button", { name: "Add Todo" }).click();

		// Confirm Add
		const addConfirm = page.getByRole("button", { name: CONFIRM_REGEX });

		await expect(addConfirm).toBeVisible();
		await addConfirm.click({ force: true });

		// ✅ Delay after create
		await page.waitForTimeout(1000);

		// ========================
		// VERIFY CREATED
		// ========================

		const createdTodo = page
			.getByTestId("todo-card")
			.filter({ hasText: "My Test Todo" });

		await expect(createdTodo).toHaveCount(1);

		// ========================
		// EDIT TODO
		// ========================

		const todoCard = createdTodo.first();

		await expect(todoCard).toBeVisible();

		await todoCard.getByTestId("edit-todo-btn").click({ force: true });

		// Wait for modal
		await expect(
			page.getByRole("heading", { name: EDIT_TODO_REGEX })
		).toBeVisible();

		await page.waitForTimeout(3000); // ✅ Wait for modal animation

		// Update fields
		const titleInput = page.getByPlaceholder("Enter title");
		await titleInput.fill("My Edited Todo");

		await page.waitForTimeout(3000); // ✅ Wait for title input to update

		const descInput = page.getByPlaceholder("Enter description");
		await descInput.fill("This todo has been edited");

		await page.waitForTimeout(3000); // ✅ Wait for description input to update

		// Update
		const updateBtn = page.getByRole("button", { name: UPDATE_REGEX });

		await expect(updateBtn).toBeVisible();

		await updateBtn.click({ force: true });
		await page.waitForTimeout(3000); // ✅ Wait for update to process

		// Confirm Update
		const updateConfirm = page.getByRole("button", { name: CONFIRM_REGEX });

		await expect(updateConfirm).toBeVisible();

		await updateConfirm.click({ force: true });

		// ✅ Delay after edit
		await page.waitForTimeout(5000);

		// ========================
		// VERIFY UPDATED
		// ========================

		const updatedTodo = page
			.getByTestId("todo-card")
			.filter({ hasText: "My Edited Todo" });

		await expect(updatedTodo).toHaveCount(1);

		await expect(updatedTodo).toContainText("This todo has been edited");

		await page.waitForTimeout(3000); // ✅ Wait before delete

		await updatedTodo.getByTestId("delete-btn").click({ force: true });

		await page.waitForTimeout(3000); // ✅ Wait for delete dialog to appear

		// Wait for delete dialog
		const deleteDialog = page.getByRole("dialog");

		await expect(deleteDialog).toBeVisible();

		// Confirm Delete
		const deleteConfirm = page.getByRole("button", { name: CONFIRM_REGEX });

		await page.waitForTimeout(3000); // ✅ Wait for confirm button

		await deleteConfirm.click({ force: true });

		// ✅ Delay after delete
		await page.waitForTimeout(5000);

		// ========================
		// VERIFY DELETED
		// ========================

		await expect(updatedTodo).toHaveCount(0);
	});
});
