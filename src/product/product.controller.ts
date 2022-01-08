import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';
import { CreateProductDto } from './dto/create-ptoduct.dto';
import { ProductService } from './product.service';
import { NOT_FOUND_PRODUCT } from './product.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}
	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return this.productService.create(dto);
	}

	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const product = await this.productService.findById(id);
		if (!product) {
			throw new NotFoundException(NOT_FOUND_PRODUCT);
		}

		return product;
	}

	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deleted = await this.productService.deleteById(id);
		if (!deleted) {
			throw new NotFoundException(NOT_FOUND_PRODUCT);
		}

		return deleted;
	}

	@Patch(':id')
	async patch(@Param('id') id: string, @Body() dto: ProductModel) {
		const updated = await this.productService.updateById(id, dto);
		if (!updated) {
			throw new NotFoundException(NOT_FOUND_PRODUCT);
		}

		return updated;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto) {
		return this.productService.findWithReviews(dto);
	}
}